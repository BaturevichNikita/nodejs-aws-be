import { APIGatewayProxyEvent, APIGatewayProxyHandler, SQSEvent, SQSHandler } from 'aws-lambda';
import 'source-map-support/register';
import { GetProductByID, GetProducts, CreateProduct, CatalogBatchProcess } from './handlers';

const getAllProducts: APIGatewayProxyHandler = async () => GetProducts();

const getProductByID: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => GetProductByID(event);

const createNewProduct: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => CreateProduct(event);

const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => CatalogBatchProcess(event);

export { getAllProducts, getProductByID, createNewProduct, catalogBatchProcess };
