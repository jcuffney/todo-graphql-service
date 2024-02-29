import { fromGlobalId } from '../../lib/relay.js';

export default ({ id: globalId }) => {
    const { type } = fromGlobalId(globalId);
    return type;
}