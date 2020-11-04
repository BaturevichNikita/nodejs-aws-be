import { GetProducts } from '../../handlers';
import productsList from '../../mocks/productList.json';

describe('Get all products', () => {
    it('should return right response', async () => {
        const response = await GetProducts();

        expect(response).toStrictEqual({
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(productsList, null, 2),
        });
    });
});
