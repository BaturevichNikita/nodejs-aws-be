import { SQSEvent, SQSRecord } from 'aws-lambda';
import { CatalogBatchProcess } from '../../handlers';
import SNSPublisher from '../../utils/sns';
import { SNS } from 'aws-sdk';
import Product from '../../models/Product';

const payload = { Records: [] } as SQSEvent;

const snsPublisher: SNSPublisher = {
    sns: new SNS(),
    arn: 'anr',
    async sendSuccessMsg(subject: string, message: string) {
        console.log(subject, message);
        return Promise.resolve(null);
    },
    sendErrorMsg: (subject: string, message: string) => {
        console.log(subject, message);
        return Promise.resolve(null);
    },
};

jest.mock('../../utils/sns', () => jest.fn().mockImplementation(() => snsPublisher));

describe('Catalog batch process', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Product.validate = data => ({ value: data, error: null });
        Product.Create = () => Promise.resolve(null);
    });
    it('should call sendSuccessMsg', async () => {
        const record = { body: '{"finish": true}' } as SQSRecord;
        payload.Records.push(record);

        const spy = jest.spyOn(snsPublisher, 'sendSuccessMsg');

        await CatalogBatchProcess(payload);

        expect(spy).toHaveBeenCalledWith('Catalog batch proccess success end.', 'All messages has been processed!');
    });

    it('should call sendErrorMsg', async () => {
        payload.Records = undefined;

        const spy = jest.spyOn(snsPublisher, 'sendErrorMsg');

        await CatalogBatchProcess(payload);

        expect(spy).toHaveBeenCalledWith(
            'Error while processing catalog.',
            "Cannot read property 'length' of undefined"
        );
    });
});
