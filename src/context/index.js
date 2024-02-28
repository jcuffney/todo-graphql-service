import { toGlobalId } from "../lib/relay.js";
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NodeClient } from '../lib/dynamodb.js';

export default ({ req }) => {

    const {
        NODE_ENV = "development",
        AWS_REGION = "us-east-1",
        USER_TABLE = "todo-dev-User",
    } = process.env;

    const dynamodbClient = new DynamoDBClient({ region: AWS_REGION });
    const docClient = DynamoDBDocumentClient.from(dynamodbClient);

    const User = NodeClient(docClient, USER_TABLE);

    return {
        headers: req.headers,
        env: NODE_ENV,
        // the currently logged in user
        user: {
            id: toGlobalId("User", 1),
            firstName: "Joseph",
            lastName: "Cuffney",
            email: "josephcuffney@gmail.com",
            username: "jcuffney",
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        },
        User,
    };
};
