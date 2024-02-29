/* eslint-disable no-await-in-loop */
/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */

import {
    append,
    curry, flip,
    identity,
} from 'ramda';

export const reduce = curry(async (pred, acc, iter) => {
    for await (const item of iter) acc = await pred(acc, item);
    return acc;
});

// resolve an iterable into an array
// Iterable<T> -> Promise<[T]>
export const toArray = reduce(flip(append), []);

// returns a flattened array of async iterables
// Iterable<T> -> AsyncIterator<T>
export const flatten = async function* flatten(iter) {
    for await (const items of iter) yield* items;
};

// return the first item which satisfies the fn
export const find = curry(async (fn, iter) => {
    for await (const item of iter) {
        if (await fn(item)) return item;
    }

    return null;
});

// apply a function fn to each item in iterable
export const forEach = curry(async function* forEach(fn, iter) {
    for await (const item of iter) {
        await fn(item);
        yield item;
    }
});

export const groupBy = curry((keyFn, list) => reduce((acc, element) => {
    const key = keyFn(element);
    acc[key] = (acc[key] || []).concat(element);
    return acc;
}, {}, list));

// filter iterable based on function
export const filter = curry(async function* filter(fn, iter) {
    for await (const item of iter) if (await fn(item)) yield item;
});

// take a num of items
export const take = curry(async function* take(num, iter) {
    for await (const item of iter) {
        if (num <= 0) return;
        yield item;
        num -= 1;
    }
});

// take items after the function is satisfied
export const takeAfter = curry((fn, iter) => {
    let takeItem = false;
    // eslint-disable-next-line consistent-return
    return filter(async (item) => {
        if (takeItem) return true;
        if (await fn(item)) takeItem = true;
    }, iter);
});

// count items in iterable
export const count = async (iter) => {
    let num = 0;
    // eslint-disable-next-line no-unused-vars
    for await (const _ of iter) num += 1;
    return num;
};

// apply a function to each yielded item
export const map = curry(async function* map(fn, iter) {
    for await (const item of iter) yield await fn(item);
});

// returns an async iterator for an iterable
export const from = map(identity);

// copy an async iterable num times
export const tee = curry((num, iter) => {
    iter = from(iter);

    return [...Array(num)]
        .map(() => [])
        .map(async function* tee(cache, i, caches) {
            while (true) {
                if (!cache.length) {
                    const { done, value } = await iter.next();
                    if (done) {
                        if (cache.length) yield* cache;
                        return;
                    }
                    for (const cache of caches) cache.push(value);
                }
                yield cache.shift();
            }
        });
});

export const mapSync = curry(function* mapSync(fn, iter) {
    for (const item of iter) yield fn(item);
});