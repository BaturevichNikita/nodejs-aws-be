import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
    service: {
        name: 'import-service-be',
    },
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true,
        },
    },
    plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
    provider: {
        name: 'aws',
        runtime: 'nodejs12.x',
        region: 'eu-west-1',
        apiGateway: {
            minimumCompressionSize: 1024,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            BUCKET: process.env.BUCKET,
            UPLOAD_FOLDER: process.env.UPLOAD_FOLDER,
            SQS_URL: {
                'Fn::ImportValue': 'SQSQueueUrl',
            },
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: 's3:ListBucket',
                Resource: 'arn:aws:s3:::${self:provider.environment.BUCKET}',
            },
            {
                Effect: 'Allow',
                Action: 's3:*',
                Resource: 'arn:aws:s3:::${self:provider.environment.BUCKET}/*',
            },
            {
                Effect: 'Allow',
                Action: 'sqs:*',
                Resource: {
                    'Fn::ImportValue': 'SQSQueueArn',
                },
            },
        ],
    },
    functions: {
        importProductsFile: {
            handler: 'handler.importProductsFile',
            events: [
                {
                    http: {
                        method: 'get',
                        path: 'import',
                        cors: true,
                        request: {
                            parameters: {
                                querystrings: {
                                    name: true,
                                },
                            },
                        },
                        authorizer: {
                            name: 'TokenAuthorizer',
                            arn:
                                'arn:aws:lambda:eu-west-1:993072994796:function:authorization-service-be-dev-basicAuthorizer',
                            resultTtlInSeconds: 0,
                            identitySource: 'method.request.header.Authorization',
                            type: 'token',
                        },
                    },
                },
            ],
        },
        importFileParser: {
            handler: 'handler.importFileParser',
            events: [
                {
                    s3: {
                        bucket: '${self:provider.environment.BUCKET}',
                        event: 's3:ObjectCreated:*',
                        rules: [{ prefix: '${self:provider.environment.UPLOAD_FOLDER}/', suffix: '.csv' }],
                        existing: true,
                    },
                },
            ],
        },
    },

    resources: {
        Resources: {
            GatewayResponseAccessDeied: {
                Type: 'AWS::ApiGateway::GatewayResponse',
                Properties: {
                    RestApiId: {
                        Ref: 'ApiGatewayRestApi',
                    },
                    ResponseType: 'ACCESS_DENIED',
                    ResponseParameters: {
                        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
                        'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
                    },
                },
            },

            GatewayResponseUnathorized: {
                Type: 'AWS::ApiGateway::GatewayResponse',
                Properties: {
                    RestApiId: {
                        Ref: 'ApiGatewayRestApi',
                    },
                    ResponseType: 'UNAUTHORIZED',
                    ResponseParameters: {
                        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
                        'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
                    },
                },
            },
        },
    },
};

module.exports = serverlessConfiguration;
