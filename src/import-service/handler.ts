import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import 'source-map-support/register';
import { ImportFileParser, ImportProductsFile } from './handlers';

const importProductsFile: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => ImportProductsFile(event);

const importFileParser: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => ImportFileParser(event);

export { importProductsFile, importFileParser };
