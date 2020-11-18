import { APIGatewayProxyResult } from 'aws-lambda';

enum Statuses {
    success = 200,
    invalidData = 400,
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

    static success(data: any, code?: number): APIGatewayProxyResult {
        return this.send(code | Statuses.success, data);
    }

    static internalError(message: string): APIGatewayProxyResult {
        return this.send(Statuses.error, message);
    }

    static invalidDataError(message: string): APIGatewayProxyResult {
        return this.send(Statuses.invalidData, message);
    }
}
