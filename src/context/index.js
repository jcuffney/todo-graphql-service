import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NodeClient } from '../lib/dynamodb.js';

export default ({ req = {} } = {}) => {

    // eventually this would come from a token
    const USER_ID = "VXNlcjox";

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

    return async () => {
        const currentUser = await User.get({ Key: { id: USER_ID } });

        return {
            // general
            headers: req.headers,
            env: NODE_ENV,
            // logged in user
            user: currentUser,
            // dynamodb tables
            User,
            Task,
        };
    }
};
