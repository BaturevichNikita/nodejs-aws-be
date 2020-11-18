import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { Response } from '../utils';

const ImportProductsFile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { REGION, BUCKET: Bucket, UPLOAD_FOLDER } = process.env;
        const s3 = new AWS.S3({ region: REGION });

        console.log('Get signed url');
        console.log('Query string parameters: ', event.queryStringParameters);

        const { name } = event.queryStringParameters;

        if (!name) throw new Error('Name parameter is required!');

        const signedUrl = await s3.getSignedUrlPromise('putObject', {
            Bucket,
            Key: `${UPLOAD_FOLDER}/${name}`,
            Expires: 60,
            ContentType: 'text/csv',
        });

        return Response.success(signedUrl);
    } catch (err) {
        return Response.internalError(err.message);
    }
};

export default ImportProductsFile;
