import {
    BatchGetCommand,
    DeleteCommand,
    PutCommand,
    QueryCommand,
    ScanCommand,
    UpdateCommand,
    paginateQuery,
    paginateScan,
} from '@aws-sdk/lib-dynamodb';
import Dataloader from 'dataloader';
import {
    curry,
    indexBy, isEmpty, isNil, map, omit, path, prop, tap,
} from 'ramda';

import { isObject } from './is.js';

// batch get multiple nodes by id, max 100
const getNodes = curry((ddb, TableName, ids) => {
    const Keys = ids.map((id) => {
        const isObj = isObject(id);
        if ((isObj && isEmpty(id)) || isNil(id)) {
            throw Error(`Invalid value for ID ${id} provided`);
        }
        return isObj ? id : ({ id });
    });
    const cmd = new BatchGetCommand({
        RequestItems: { [TableName]: { Keys } },
    });
    return ddb.send(cmd)
        .then(path(['Responses', TableName]))
        .then((records) => {
            const recordsById = indexBy(prop('id'), records);
            // preserve id order and return null for missing records
            return map(({ id }) => (recordsById[id] || null), Keys);
        })
        .catch((err) => { throw Error(err); });
});

export const NodeClient = curry((ddb, TableName) => {
    const loader = new Dataloader(
        getNodes(ddb, TableName),
        { maxBatchSize: 100 },
    );
    return {
        async get(opts) {
            const id = path(['Key', 'id'], opts);
            return loader.load(id);
        },
        async put(opts) {
            const Item = prop('Item', opts);
            const putCommand = new PutCommand({
                TableName,
                Item,
            });
            return ddb.send(putCommand)
                // put new item in cache
                .then(tap(() => loader.clear(Item.id).prime(Item.id, Item)))
                // always return the new record.
                .then(() => Item)
                .catch((err) => { throw Error(err); });
        },
        async update(opts) {
            const updateCommand = new UpdateCommand({
                ReturnValues: 'ALL_NEW',
                ...opts,
                TableName,
            });
            return ddb.send(updateCommand)
                // always return the new record. i.e ReturnValues: 'ALL_NEW'
                .then(path(['Attributes']))
                // put updated item in cache
                .then(tap((node) => loader.clear(node.id).prime(node.id, node)))
                .catch((err) => { throw Error(err); });
        },
        async delete(opts) {
            const deleteCommand = new DeleteCommand({
                ...opts,
                TableName,
            });
            return ddb.send(deleteCommand)
                .then(() => loader.clear(path(['Key', 'id'], opts)))
                .then(() => true)
                .catch((err) => { throw Error(err); });
        },
        async query(opts) {
            const queryCommand = new QueryCommand({
                ...opts,
                TableName,
            });
            return ddb.send(queryCommand)
                .then(path(['Items']))
                .catch((err) => { throw Error(err); });
        },
        async scan(opts) {
            const scanCommand = new ScanCommand({
                ...opts,
                TableName,
            });
            return ddb.send(scanCommand)
                .then(path(['Items']))
                .catch((err) => { throw Error(err); });
        },
        async* scanIterator(opts) {
            const paginator = paginateScan({
                client: ddb,
                startingToken: opts.ExclusiveStartKey,
            }, {
                ...omit(['ExclusiveStartKey'], opts),
                TableName,
            });
            for await (const page of paginator) {
                for (const item of page.Items) {
                    yield item;
                }
            }
        },
        async* queryIterator(opts) {
            const paginator = paginateQuery({
                client: ddb,
                startingToken: opts.ExclusiveStartKey,
            }, {
                ...omit(['ExclusiveStartKey'], opts),
                TableName,
            });
            for await (const page of paginator) {
                for (const item of page.Items) {
                    yield item;
                }
            }
        },
    };
});