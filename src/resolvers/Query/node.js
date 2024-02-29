import { GraphQLError } from "graphql";
import { fromGlobalId } from "../../lib/relay.js";

export default (_, { id: globalId }, { User }) => {
    const { type } = fromGlobalId(globalId);
    if (type === 'User') {
        return User.get(globalId)
    }
    throw new GraphQLError(`Unknown type: ${type}`);
}
