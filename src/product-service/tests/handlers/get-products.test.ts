import { GetProducts } from '../../handlers';
import { ProductWithStockRecord } from '../../interfaces';
import Product from '../../models/Product';

jest.mock('../../models/Product');

const records: ProductWithStockRecord[] = [
    {
        id: 'test1',
        description: 'test desc1',
        count: 1,
        price: 1,
        title: 'test title1',
    },
];

describe('Get all products', () => {
    it('should return right response', async () => {
        Product.FindAll = () => Promise.resolve(records);
        const response = await GetProducts();

        expect(response).toStrictEqual({
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(records, null, 2),
        });
    });
});
