import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { findOneProductByID } from '../services/product-service';
import { Response } from '../utils';

const GetProductByID = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = +event.pathParameters.productID;

        if (isNaN(id)) throw new Error('ID is not a number!');

        const product = await findOneProductByID(id);

        if (!product) throw new Error(`Product with id = ${id} does not exist!`);

        return Response.success(product);
    } catch (err) {
        return Response.error(err.message);
    }
};

export default GetProductByID;
