import { fromGlobalId } from '../lib/relay.js';

export default (_, { id: globalId }, { User }) => {
    const { type } = fromGlobalId(globalId);
    if (type === 'User') {
        return User.get(globalId)
        // return { id, __typename: type };
    }
    throw new Error(`Unknown type: ${type}`);
}