import { curry, path, pathOr } from 'ramda';

export const toGlobalId = (type, id) => {
    return Buffer.from(type + ":" + id).toString('base64');
}

export const fromGlobalId = (globalId) => {
    const [type, id] = Buffer.from(globalId, 'base64').toString().split(':');
    return { type, id };
}

export const nodeField = curry((keyPath, parent) => path(keyPath, parent));

export const nodeFieldOr = curry((defaultValue, keyPath, parent) => pathOr(defaultValue, keyPath, parent));