import { APIGatewayProxyResult } from 'aws-lambda';
import { findAllProducts } from '../services/product-service';
import { Response } from '../utils';

const GetProducts = async (): Promise<APIGatewayProxyResult> => {
    try {
        const products = await findAllProducts();
        return Response.success(products);
    } catch (err) {
        return Response.error(err.message);
    }
};

export default GetProducts;
