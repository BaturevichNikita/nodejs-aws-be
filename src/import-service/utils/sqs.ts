import { SQS } from 'aws-sdk';
import makeMessageGroupId from './msgGroupIDGenerator';

export default class SQSSender {
    sqs: SQS;
    sqsUrl: string;
    messageGroupId: string;

    constructor() {
        this.sqs = new SQS();
        this.sqsUrl = process.env.SQS_URL;
        this.messageGroupId = makeMessageGroupId();
    }

    send(data: object) {
        return this.sqs
            .sendMessage({
                QueueUrl: this.sqsUrl,
                MessageBody: JSON.stringify(data),
                MessageGroupId: this.messageGroupId,
            })
            .promise();
    }
}
