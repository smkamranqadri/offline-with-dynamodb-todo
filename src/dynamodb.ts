import * as AWS from 'aws-sdk';

declare var process;

let options = {};

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}

export default new AWS.DynamoDB.DocumentClient(options);
