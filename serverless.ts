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
    plugins: ['serverless-webpack'],
    provider: {
        name: 'aws',
        runtime: 'nodejs12.x',
        region: 'eu-west-1',
        apiGateway: {
            minimumCompressionSize: 1024,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
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
    },
};

module.exports = serverlessConfiguration;
