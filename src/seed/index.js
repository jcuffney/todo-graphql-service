import getContext from '../context/index.js';
import { toGlobalId } from '../lib/relay.js';

console.log('seeding the database with some data...');

const {
    User,
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

console.log('done.');
