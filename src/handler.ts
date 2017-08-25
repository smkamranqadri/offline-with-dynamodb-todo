import * as uuid from 'uuid';
import dynamodb from './dynamodb';

declare var process;

export function addTodo(event, context, callback) {

    const timestamp = new Date().getTime();
    const { text } = JSON.parse(event.body);
    const data = {
        text
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
        TableName: process.env.TODO_DYNAMODB_TABLE,
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

export function updateTodo(event, context, callback) {

    const timestamp = new Date().getTime();
    const { text, checked } = JSON.parse(event.body);
    const data = {
        id: event.pathParameters.id,
        text,
        checked
    };

    if (!data.text) {
        console.error('Missing Data');
        callback(new Error('Couldn\'t process the data is missing.'));
        return;
    }
    if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
        console.error('Validation Failed');
        callback(new Error('Couldn\'t process the data is invalid.'));
        return;
    }

    const params = {
        TableName: process.env.TODO_DYNAMODB_TABLE,
        Key: {
            id: data.id,
        },
        ExpressionAttributeNames: {
            '#todo_text': 'text',
        },
        ExpressionAttributeValues: {
            ':text': data.text,
            ':checked': data.checked,
            ':updatedAt': timestamp,
        },
        UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
    };

    dynamodb.update(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(new Error('Couldn\'t put in database.'));
            return;
        }
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
        callback(null, response);
    });

}

export function deleteTodo(event, context, callback) {

    const data = {
        id: event.pathParameters.id
    };

    const params = {
        TableName: process.env.TODO_DYNAMODB_TABLE,
        Key: {
            id: data.id,
        },
    };

    // delete the todo from the database
    dynamodb.delete(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(new Error('Couldn\'t remove the todo item.'));
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify({}),
        };
        callback(null, response);
    });

}

export function getTodo(event, context, callback) {

    const data = {
        id: event.pathParameters.id
    };

    const params = {
        TableName: process.env.TODO_DYNAMODB_TABLE,
        Key: {
            id: data.id,
        },
    };

    // fetch todo from the database
    dynamodb.get(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(new Error('Couldn\'t fetch the todo item.'));
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
        callback(null, response);
    });

}

export function getTodos(event, context, callback) {

    const params = {
        TableName: process.env.TODO_DYNAMODB_TABLE,
    };

    // fetch all todos from the database
    dynamodb.scan(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(new Error('Couldn\'t fetch the todos.'));
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
        callback(null, response);
    });

}
