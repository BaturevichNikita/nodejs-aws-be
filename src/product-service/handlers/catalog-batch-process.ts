import { SQSEvent } from 'aws-lambda';
import { Product } from '../models';
import { SNSPublisher } from '../utils';

const CatalogBatchProcess = async (event: SQSEvent): Promise<void> => {
    const snsPublisher = new SNSPublisher();
    console.log(snsPublisher);
    try {
        let sendMessage = false;

        console.log(event.Records.length);
        const promises = event.Records.reduce((acc: Promise<string>[], { body }) => {
            const record = JSON.parse(body);

            console.log(record);

            if (record.finish) {
                sendMessage = true;
            } else {
                const { value, error } = Product.validate(record);
                error ? console.log(error) : acc.push(Product.Create(value));
            }
            return acc;
        }, []);

        if (promises.length) {
            await Promise.all(promises);
        }

        if (sendMessage) {
            console.log('Sending success email message...');
            await snsPublisher.sendSuccessMsg(
                'Catalog batch proccess success end.',
                'All messages has been processed!'
            );
        }
    } catch (err) {
        console.log(`Sending error email message...${err.message}`);
        await snsPublisher.sendErrorMsg('Error while processing catalog.', err.message);
    }
};

export default CatalogBatchProcess;
