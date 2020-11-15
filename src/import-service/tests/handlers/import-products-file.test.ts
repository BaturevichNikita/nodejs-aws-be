import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWSMock from 'aws-sdk-mock';
import { ImportProductsFile } from '../../handlers';

const payload = {} as APIGatewayProxyEvent;
const mockedUrl = 'https://test-url';

describe('Import products file', () => {
    beforeAll(() => {
        process.env = { BUCKET: 'test-bucket', UPLOAD_FOLDER: 'test-upload-folder' };
    });

    beforeEach(() => {
        AWSMock.mock('S3', 'getSignedUrl', mockedUrl);
    });

    afterEach(() => {
        AWSMock.restore('S3');
    });

    it('should return right response', async () => {
        payload.queryStringParameters = {
            name: 'test.csv',
        };
        const response = await ImportProductsFile(payload);

        expect(response).toStrictEqual({
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(mockedUrl, null, 2),
        });
    });

    it('should throw error - name required', async () => {
        payload.queryStringParameters = {};
        const response = await ImportProductsFile(payload);

        expect(response).toStrictEqual({
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify('Name parameter is required!', null, 2),
        });
    });
});
