import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { configDotenv } from 'dotenv';
configDotenv();

export class AwsSns {
    
    private snsClient: SNSClient;

    constructor() {
        this.snsClient = new SNSClient({
            credentials: {
                accessKeyId: process.env.AWS_SNS_ACCESS_KEY as string,
                secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY as string
            },
            region: process.env.AWS_SNS_REGION as string
        }); 
    }

    public async sendMessage(phone: string, code: string): Promise<void> {
        const input: PublishCommandInput = { // PublishInput
            PhoneNumber: phone,
            Message: code, // required
        };
        const command = new PublishCommand(input);
        await this.snsClient.send(command);
    }   
}