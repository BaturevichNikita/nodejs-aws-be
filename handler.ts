import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { GetProductByID, GetProducts } from './handlers';

const getAllProducts: APIGatewayProxyHandler = async () => GetProducts();

const getProductByID: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => GetProductByID(event);

export { getAllProducts, getProductByID };
