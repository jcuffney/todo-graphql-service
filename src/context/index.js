import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NodeClient } from '../lib/dynamodb.js';

import pubsub from '../context/pubsub.js';

export default () => {
    // this is executed at server startup
    const {
        NODE_ENV = "development",
        AWS_REGION = "us-east-1",
        USER_TABLE = "todo-dev-User",
        TASK_TABLE = "todo-dev-Task",
    } = process.env;

    const dynamodbClient = new DynamoDBClient({ region: AWS_REGION });
    const docClient = DynamoDBDocumentClient.from(dynamodbClient);

    const User = NodeClient(docClient, USER_TABLE);
    const Task = NodeClient(docClient, TASK_TABLE);

    // this function is executed once per request
    return async ({ req = {} } = {}) => {
        // eventually this would come from a token
        const USER_ID = "VXNlcjox";
        const currentUser = await User.get(USER_ID);

        return {
            // general
            headers: req.headers,
            env: NODE_ENV,
            // logged in user
            user: currentUser,
            // dynamodb tables
            User,
            Task,
            // pubsub for subscriptions
            pubsub,
        };
    }
};
