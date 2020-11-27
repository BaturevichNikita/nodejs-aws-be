import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Product } from '../models';
import { Response } from '../utils';

const GetProductByID = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('GET PRODUCT BY ID');
        console.log('Parameters: ', event.pathParameters);

        const { productID } = event.pathParameters;

        const product = await Product.FindOneByID(productID);

        if (!product) throw new Error(`Product with id = ${productID} does not exist!`);

        return Response.success(product);
    } catch (err) {
        return Response.internalError(err.message);
    }
};

export default GetProductByID;
