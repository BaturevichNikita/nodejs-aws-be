import { SNS } from 'aws-sdk';
export default class SNSPublisher {
    sns: SNS;
    arn: string;
    constructor() {
        this.sns = new SNS();
        this.arn = process.env.SNS_ARN;
    }

    async sendSuccessMsg(subject: string, msg: string) {
        return this.sns
            .publish({
                MessageAttributes: {
                    status: {
                        DataType: 'String',
                        StringValue: 'success',
                    },
                },
                Subject: subject,
                Message: msg,
                TopicArn: this.arn,
            })
            .promise();
    }

    async sendErrorMsg(subject: string, msg: string) {
        return this.sns
            .publish({
                MessageAttributes: {
                    status: {
                        DataType: 'String',
                        StringValue: 'error',
                    },
                },
                Subject: subject,
                Message: msg,
                TopicArn: this.arn,
            })
            .promise();
    }
}
