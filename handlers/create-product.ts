import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { Product } from '../models';
import Response from '../utils/response';

const CreateProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('CREATE NEW PRODUCT');
        console.log('Body: ', event.body);

        const { value, error } = Product.validate(JSON.parse(event.body));

        if (error) {
            return Response.invalidDataError(error.message);
        }

        const id = await Product.Create(value);
        const insertedProduct = await Product.FindOneByID(id);
        return Response.success(insertedProduct);
    } catch (error) {
        return Response.internalError(error.message);
    }
};

export default CreateProduct;
