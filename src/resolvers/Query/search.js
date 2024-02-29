import { applyTo, pipe, pick } from "ramda"
import { serializeKey } from '../../lib/string.js';
import { map } from "../../lib/iterable.js"
import {
    nodeToEdgeWith, relayEdgesConnection
} from '../../lib/graphql.js';


const getNodeCursor = pipe(pick(['id']), serializeKey);

export default (_, { input: { first, after, query } = {} }, { User }) => {
    console.log("search query=", query)

    return applyTo({}, pipe(
        User.scanIterator,
        map(nodeToEdgeWith(getNodeCursor)),
        relayEdgesConnection({ after, first }),
    ))

    // return ({ edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } })

}
