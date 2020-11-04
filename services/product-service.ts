import { Product } from '../interfaces';
import productsList from '../mocks/productList.json';

const promisify = <T>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 100));

const findAllProducts = async (): Promise<Product[]> => promisify(productsList);

const findOneProductByID = (id: number): Promise<Product> => {
    const product = productsList.find(item => item.id === id);
    return promisify(product);
};

export { findAllProducts, findOneProductByID };
