import getContext from '../context/index.js';
import { toGlobalId } from '../lib/relay.js';
import { uuid } from '../lib/uuid.js';

console.log('seeding the database with some data...');

const {
    User
} = getContext({ req: { headers: {} } });

await User.put({
    Item: {
        id: toGlobalId('User', uuid()),
        firstName: 'Joseph',
        lastName: 'Cuffney',
        email: 'josephcuffney@gmail.com',
        username: 'jcuffney',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
    }
})

console.log('done.');
