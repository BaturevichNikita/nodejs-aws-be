import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { GetProductByID, GetProducts, CreateProduct } from './handlers';

const getAllProducts: APIGatewayProxyHandler = async () => GetProducts();

const getProductByID: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => GetProductByID(event);

const createNewProduct: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => CreateProduct(event);

export { getAllProducts, getProductByID, createNewProduct };
