import Date from '../scalars/date.js';
import User_tasks from './User/tasks.js';
import node from './node.js';

import { nodeField, nodeFieldOr } from '../lib/relay.js';

export default {
  Date,
  Node: {
    __resolveType: ({ __typename }) => __typename,
  },
  User: {
    __resolveType: ({ __typename }) => __typename,
    id: nodeField(['id']),
    firstName: nodeFieldOr('', ['firstName']),
    lastName: nodeField('', ['lastName']),
    email: nodeField(['email']),
    username: nodeField(['username']),
    createdAt: nodeField(['createdAt']),
    updatedAt: nodeField(['updatedAt']),
    deletedAt: nodeField(['deletedAt']),

    tasks: User_tasks,
  },
  Query: {
    health: () => "ok",
    node,
    whoami: (_, __, { user }) => user,
    search: () => [],
  },
};