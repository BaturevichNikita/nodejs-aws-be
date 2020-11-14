import { APIGatewayProxyResult } from 'aws-lambda';
import { Product } from '../models';
import { Response } from '../utils';

const GetProducts = async (): Promise<APIGatewayProxyResult> => {
    try {
        console.log('GET ALL PRODUCTS');

        const products = await Product.FindAll();
        return Response.success(products);
    } catch (err) {
        return Response.internalError(err.message);
    }
};

export default GetProducts;
