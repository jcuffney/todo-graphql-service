import stringify from 'fast-json-stable-stringify';
import {
    identity,
    isNil,
    pipe,
    replace, test,
    toLower,
    unless,
    when,
} from 'ramda';

// string -> string
export const slugify = pipe(
    toLower,
    replace(/[^a-z0-9]/g, '-'),
    replace(/-+/g, '-'),
    replace(/^-|-'$/g, ''),
);

export const isValidSlug = test(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/);

export const fromBase64 = (str) => Buffer.from(str, 'base64').toString();

export const toBase64 = (str) => Buffer.from(str).toString('base64');

// Object -> String
export const serializeKey = when(identity, pipe(stringify, toBase64));

// String -> Object
export const parseKey = unless(isNil, (cursor) => {
    try {
        return JSON.parse(fromBase64(cursor));
    } catch (err) {
        throw Error(`Invalid cursor: ${cursor}`);
    }
});