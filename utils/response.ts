import { APIGatewayProxyResult } from 'aws-lambda';

enum Statuses {
    success = 200,
    error = 500,
}

export default class Response {
    static send(statusCode: number, data: any): APIGatewayProxyResult {
        return {
            statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            },
            body: JSON.stringify(data, null, 2),
        };
    }

    static success(data: any): APIGatewayProxyResult {
        return this.send(Statuses.success, data);
    }

    static error(message: string): APIGatewayProxyResult {
        return this.send(Statuses.error, message);
    }
}
