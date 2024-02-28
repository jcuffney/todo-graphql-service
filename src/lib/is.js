import { curry, equals, test } from 'ramda';

export const isNull = equals(null);

// eslint-disable-next-line valid-typeof
export const isTypeOf = curry((type, val) => typeof val === type);

export const { isArray } = Array;

export const isObject = (obj) => (isTypeOf('object', obj) && !isNull(obj) && !isArray(obj));

export const isString = isTypeOf('string');

export const isUndefined = (val) => val === undefined;

export const isEmptyString = (val) => val === '';

export const isEmail = test(/^[A-Za-z0-9._+\-']+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/);

export const isHexCode = test(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);