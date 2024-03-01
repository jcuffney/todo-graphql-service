import getContext from '../context/index.js';
import { toGlobalId } from '../lib/relay.js';

console.log('seeding the database with some data...');

const {
    User,
    Task,
} = await getContext({ req: {} })();

await User.put({
    id: toGlobalId('User', "1"),
    firstName: 'Joseph',
    lastName: 'Cuffney',
    email: 'josephcuffney@gmail.com',
    username: 'jcuffney',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
})

await Task.put({
    id: toGlobalId('Task', "1"),
    title: "task 1",
    description: "description 1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    userId: toGlobalId('User', "1"),
})

await Task.put({
    id: toGlobalId('Task', "2"),
    title: "task 2",
    description: "description 2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    userId: toGlobalId('User', "1"),
})

await Task.put({
    id: toGlobalId('Task', "3"),
    title: "task 3",
    description: "description 3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    userId: toGlobalId('User', "1"),
})


console.log('done.');
