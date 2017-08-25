import * as uuid from 'uuid';
import dynamodb from './dynamodb';

declare var process;

export function hello(event, context, callback) {

    const timestamp = new Date().getTime();
    const data = {
        text: 'hello world'
    };

    if (!data.text) {
        console.error('Missing Data');
        callback(new Error('Couldn\'t process the data is missing.'));
        return;
    }
    if (typeof data.text !== 'string') {
        console.error('Validation Failed');
        callback(new Error('Couldn\'t process the data is invalid.'));
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: uuid.v1(),
            text: data.text,
            checked: false,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    dynamodb.put(params, (error) => {
        if (error) {
            console.error(error);
            callback(new Error('Couldn\'t put in database.'));
            return;
        }
        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        };
        callback(null, response);
    });

}
