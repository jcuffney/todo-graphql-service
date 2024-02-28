import { fromGlobalId } from '../lib/relay.js';

export default (_, { id: globalId }) => {
    const { id, type } = fromGlobalId(globalId);
    if (type === 'User') {
        // return User.get(id)
        return { id, __typename: type };
    }
    throw new Error(`Unknown type: ${type}`);
}