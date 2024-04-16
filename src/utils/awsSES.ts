import { SESClient, SendEmailCommand, SendEmailCommandInput} from '@aws-sdk/client-ses'


export default class AwsSes {
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
            Source: "matthew.lee0619@gmail.com",
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