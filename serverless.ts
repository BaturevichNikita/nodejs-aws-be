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
    },
};

module.exports = serverlessConfiguration;
