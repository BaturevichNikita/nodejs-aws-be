import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
    service: {
        name: 'comics-shop-be',
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
            PG_USER: process.env.PG_USER,
            PG_HOST: process.env.PG_HOST,
            PG_PASSWORD: process.env.PG_PASSWORD,
            PG_DB_NAME: process.env.PG_DB_NAME,
            PG_PORT: process.env.PG_PORT,
            SNS_ARN: {
                Ref: 'SNSTopic',
            },
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: 'sqs:*',
                Resource: {
                    'Fn::GetAtt': ['SQSQueue', 'Arn'],
                },
            },
            {
                Effect: 'Allow',
                Action: 'sns:*',
                Resource: {
                    Ref: 'SNSTopic',
                },
            },
        ],
    },
    functions: {
        getAllProducts: {
            handler: 'handler.getAllProducts',
            events: [
                {
                    http: {
                        method: 'get',
                        path: 'products',
                        cors: true,
                    },
                },
            ],
        },
        getProductByID: {
            handler: 'handler.getProductByID',
            events: [
                {
                    http: {
                        method: 'get',
                        path: 'products/{productID}',
                        cors: true,
                    },
                },
            ],
        },
        createNewProduct: {
            handler: 'handler.createNewProduct',
            events: [
                {
                    http: {
                        method: 'post',
                        path: 'products',
                        cors: true,
                    },
                },
            ],
        },
        catalogBatchProcess: {
            handler: 'handler.catalogBatchProcess',
            events: [
                {
                    sqs: {
                        batchSize: 5,
                        arn: {
                            'Fn::GetAtt': ['SQSQueue', 'Arn'],
                        },
                    },
                },
            ],
        },
    },

    resources: {
        Resources: {
            SQSQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'catalogItemsQueue.fifo',
                    ContentBasedDeduplication: true,
                    FifoQueue: true,
                },
            },
            SNSTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: 'createProductTopic',
                },
            },
            SNSSubscriptionSuccess: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    FilterPolicy: {
                        status: ['success'],
                    },
                    Endpoint: 'baturevichnike@gmail.com',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'SNSTopic',
                    },
                },
            },
            SNSSubscriptionError: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    FilterPolicy: {
                        status: ['error'],
                    },
                    Endpoint: 'pippin210294@gmail.com',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'SNSTopic',
                    },
                },
            },
        },
        Outputs: {
            SQSQueueUrl: {
                Value: {
                    Ref: 'SQSQueue',
                },
                Export: {
                    Name: 'SQSQueueUrl',
                },
            },
            SQSQueueArn: {
                Value: {
                    'Fn::GetAtt': ['SQSQueue', 'Arn'],
                },
                Export: {
                    Name: 'SQSQueueArn',
                },
            },
        },
    },
};

module.exports = serverlessConfiguration;
