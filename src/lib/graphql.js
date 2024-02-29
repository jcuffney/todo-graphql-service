import {
    applyTo,
    curry,
    equals,
    evolve,
    head,
    identity,
    isNil,
    join,
    last,
    path,
    pathOr,
    pipe,
    prop,
    propOr,
    split,
    splitAt,
    take as takeSync,
    tryCatch, useWith,
    when,
} from 'ramda';
import { take, toArray } from './iterable.js';
import { fromBase64, toBase64 } from './string.js';

const ID_SEPARATOR = '_';

export const toGlobalId = (type, id) => {
    if (!type) throw Error(`Invalid GID type ${type}`);
    if (isNil(id) || id === '' || Number.isNaN(id) || typeof id !== 'string') {
        throw Error(`Invalid GID id ${id}`);
    }
    return toBase64(`${type}:${id}`);
};

export const toCompoundGlobalId = useWith(toGlobalId, [
    identity,
    join(ID_SEPARATOR),
]);

export const fromGlobalId = (gid) => {
    const decoded = fromBase64(`${gid}`);
    const [type, id] = decoded.split(':');
    if (!type || isNil(id) || id === '') {
        throw Error(`Invalid GID ${gid}`);
    }
    return { type, id };
};

export const fromCompoundGlobalId = pipe(
    fromGlobalId,
    evolve({ id: split(ID_SEPARATOR) }),
);

export const nodeType = (id) => {
    if (typeof id !== 'string') {
        const typename = prop('__typename', id);
        if (typename) {
            id = prop('id', id);
            if (!id) return typename;
            const parsed = applyTo(id, tryCatch(fromGlobalId, () => null));
            if (typename !== prop('type', parsed)) {
                throw Error(`Type mismatch, expected ${parsed.type} to equal ${typename}`);
            }
            return typename;
        }
        id = prop('id', id);
    }
    const parsed = applyTo(id, tryCatch(fromGlobalId, () => null));
    return propOr(null, 'type', parsed);
};

export const isNodeOfType = useWith(equals, [identity, nodeType]);

// Creates a relay edge from a node with optional custom cursor
export const nodeToEdgeWith = curry((getCursor, node) => ({
    node,
    cursor: getCursor(node),
}));

export const nodeToEdgeWithCursor = curry((cursor, node) => ({
    node,
    cursor,
}));

export const relayEdgesConnection = curry((
    { after, first = 8 },
    iterator,
) => applyTo(iterator, pipe(
    take(first + 1),
    toArray,
))
    .then(splitAt(first))
    .then(([edges, nextEdges]) => ({
        pageInfo: {
            startCursor: prop('cursor', head(edges)),
            endCursor: prop('cursor', last(edges)),
            hasNextPage: (propOr(0, 'length', nextEdges) > 0),
            hasPreviousPage: !!after,
        },
        edges,
    })));

export const relayEdgesConnectionSync = curry((
    { after, first = 5 },
    nodes,
) => applyTo(nodes, pipe(
    takeSync(first + 1),
    splitAt(first),
    ([edges, nextEdges]) => ({
        pageInfo: {
            startCursor: prop('cursor', head(edges)),
            endCursor: prop('cursor', last(edges)),
            hasNextPage: (propOr(0, 'length', nextEdges) > 0),
            hasPreviousPage: !!after,
        },
        edges,
    }),
)));

export const assertIdOfType = curry((expected, id) => {
    const type = nodeType(id);
    if (!type || type !== expected) {
        throw Error(`Expected a ${expected} ID, got ${type} ID`);
    }
});

export const reqToContext = pipe(
    pathOr('{}', ['event', 'requestContext', 'authorizer', 'context']),
    JSON.parse,
);

export const nodeField = curry(async (model, getField, node, _, context) => {
    const field = getField(node);
    if (!isNil(field)) return field;
    return context[model].get({ Key: { id: node.id } }).then(getField);
});

export const nodeFieldOr = curry((
    defaultValue,
    model,
    getField,
    node,
    _,
    context,
) => nodeField(model, getField, node, null, context)
    .then(when(isNil, () => defaultValue)));
