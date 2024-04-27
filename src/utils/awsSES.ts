import { SESClient, SendEmailCommand, SendEmailCommandInput} from '@aws-sdk/client-ses'
import { configDotenv } from 'dotenv';
configDotenv();

export class AwsSes {

    private sesClient: SESClient;

    constructor() {
        this.sesClient = new SESClient({
            credentials: {
                accessKeyId: process.env.AWS_SES_ACCESS_KEY as string,
                secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY as string
            },
            region: process.env.AWS_SES_REGION as string
        });
    }

    public async sendEmail(toAddresses: string[], subject: string, message: string) {
        const input: SendEmailCommandInput = {
            Source: process.env.AWS_SES_SOURCE as string,
            Destination: {
                ToAddresses: toAddresses
            },
            Message: {
                Subject: { Data: subject },
                Body: { 
                    Text: { Data: message } 
                }
            }
        }
    
        const command = new SendEmailCommand(input);
        await this.sesClient.send(command);
    }
}