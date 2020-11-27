import { APIGatewayProxyEvent } from 'aws-lambda';
import { GetProductByID } from '../../handlers';
import { ProductWithStockRecord } from '../../interfaces';
import Product from '../../models/Product';

const payload = {} as APIGatewayProxyEvent;

const product: ProductWithStockRecord = {
    count: 4,
    description: 'Short Product Description 1',
    id: '1',
    price: 2.4,
    title: 'Product one',
};

jest.mock('../../models/Product');

describe('Get product by ID', () => {
    beforeEach(() => {
        payload.pathParameters = {};
        jest.clearAllMocks();
    });

    it('should return right response', async () => {
        Product.FindOneByID = () => Promise.resolve(product);

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

    it('should throw error record does not exist', async () => {
        Product.FindOneByID = async () => Promise.resolve(null);

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
