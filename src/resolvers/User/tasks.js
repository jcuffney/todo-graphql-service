import { applyTo, pipe, pick } from "ramda"
import { serializeKey, parseKey } from '../../lib/string.js';
import { map } from "../../lib/iterable.js"
import {
    nodeToEdgeWith, relayEdgesConnection
} from '../../lib/graphql.js';

const getNodeCursor = pipe(pick(['id']), serializeKey);

export default (_, { input: { first, after } = {} }, { Task, user }) => {
    const userId = user?.id;

    return applyTo({
        IndexName: 'by-userId',
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
            '#userId': 'userId',
        },
        ExpressionAttributeValues: {
            ':userId': userId,
        },
        ExclusiveStartKey: parseKey(after) ? {
            ...parseKey(after),
            userId,
        } : undefined,
    }, pipe(
        Task.queryIterator,
        map(nodeToEdgeWith(getNodeCursor)),
        relayEdgesConnection({ after, first }),
    ))
}
