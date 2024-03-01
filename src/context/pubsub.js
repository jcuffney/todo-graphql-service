import { PubSub } from "graphql-subscriptions";

// NOTE: this is not reccomended for production use
const pubsub = new PubSub();
export default pubsub;