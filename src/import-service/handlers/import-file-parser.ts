import { APIGatewayProxyResult } from 'aws-lambda';
import { Response } from '../utils';
import * as AWS from 'aws-sdk';
import { CopyObjectRequest, DeleteObjectRequest, GetObjectRequest } from 'aws-sdk/clients/s3';
import csvParser from 'csv-parser';

type DeleteOrGetParams = GetObjectRequest | DeleteObjectRequest;

const { REGION, BUCKET: Bucket, UPLOAD_FOLDER, PARSED_FOLDER } = process.env;
const s3 = new AWS.S3({ region: REGION });

async function copyFile(copyParams: CopyObjectRequest, deleteParams: DeleteOrGetParams, key: string) {
    await s3.copyObject(copyParams).promise();
    console.log(`${key} has copied into ${PARSED_FOLDER}`);
    await s3.deleteObject(deleteParams).promise();
    console.log(`${key} has deleted from ${UPLOAD_FOLDER}`);
}

const ImportFileParser = async (event: any): Promise<APIGatewayProxyResult> => {
    try {
        for (const record of event.Records) {
            const { key: Key } = record.s3.object;

            const getParams: DeleteOrGetParams = { Bucket, Key };
            const copyParams: CopyObjectRequest = {
                Bucket,
                CopySource: `${Bucket}/${Key}`,
                Key: (Key as string).replace(UPLOAD_FOLDER, PARSED_FOLDER),
            };

            const readStream = s3.getObject(getParams).createReadStream();

            console.log(`Start moving file ${Key} from ${UPLOAD_FOLDER} to ${PARSED_FOLDER}`);

            await new Promise((resolve, reject) => {
                readStream
                    .pipe(csvParser())
                    .on('data', console.log)
                    .on('error', (err: Error) => reject(err))
                    .on('end', async () => {
                        await copyFile(copyParams, getParams, Key);
                        resolve();
                    });
            });

            console.log('End moving file');
        }
        return Response.success('Import successed!', 202);
    } catch (error) {
        return Response.internalError(error.message);
    }
};

export default ImportFileParser;
