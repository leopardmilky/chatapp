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
            PhoneNumber: `+82${phone}`,
            Message: `MateLink 인증코드는 ${code}`, // required
        };
        
        const command = new PublishCommand(input);
        const result = await this.snsClient.send(command);
        console.log("sendMessage_Result: ", result);
    }   
}