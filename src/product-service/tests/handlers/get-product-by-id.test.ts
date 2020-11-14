import { APIGatewayProxyEvent } from 'aws-lambda';
import { GetProductByID } from '../../handlers';
import { Product } from '../../interfaces';

const payload = {} as APIGatewayProxyEvent;

const product: Product = {
    count: 4,
    description: 'Short Product Description 1',
    id: 1,
    price: 2.4,
    title: 'Product one',
};

describe('Get product by ID', () => {
    beforeEach(() => {
        payload.pathParameters = {};
    });

    it('should return right response', async () => {
        payload.pathParameters = {
            productID: '1',
        };
        const response = await GetProductByID(payload);

        expect(response).toStrictEqual({
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(product, null, 2),
        });
    });

    describe('Throwing errors', () => {
        it('should throw error IsNaN', async () => {
            payload.pathParameters = {
                productID: 'not a number',
            };
            const response = await GetProductByID(payload);

            expect(response).toStrictEqual({
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify('ID is not a number!', null, 2),
            });
        });

        it('should throw error record does not exist', async () => {
            payload.pathParameters = {
                productID: '20',
            };
            const response = await GetProductByID(payload);

            expect(response).toStrictEqual({
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify('Product with id = 20 does not exist!', null, 2),
            });
        });
    });
});
