import { nodeField, nodeFieldOr } from '../lib/relay.js';

import Date from '../scalars/date.js';
import tasks from './User/tasks.js';
import search from './Query/search.js';
import whoami from './Query/whoami.js';
import node from './Query/node.js';
import resolveTypeNode from './Node/__resolveType.js';

import pubsub from '../context/pubsub.js';

export default {
    Date,
    Node: {
        __resolveType: resolveTypeNode,
    },
    User: {
        id: nodeField(['id']),
        firstName: nodeFieldOr('', ['firstName']),
        lastName: nodeField('', ['lastName']),
        email: nodeField(['email']),
        username: nodeField(['username']),
        createdAt: nodeField(['createdAt']),
        updatedAt: nodeField(['updatedAt']),
        deletedAt: nodeField(['deletedAt']),

        tasks,
    },
    Task: {
        __resolveType: ({ __typename }) => __typename,
        id: nodeField(['id']),
    },
    Query: {
        health: () => "ok",
        node,
        whoami,
        search,
    },
    Subscription: {
        numberIncremented: {
            subscribe: () => pubsub.asyncIterator(['NUMBER_INCREMENTED']),
        },
    }
};