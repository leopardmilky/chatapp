import { SESClient, SendEmailCommand} from '@aws-sdk/client-ses'


class AwsSes {

    constructor() {
        this.sesClient();
    }

    private sesClient(): void {
        new SESClient({
            credentials: {
                accessKeyId: process.env.AWS_SES_ACCESS_KEY as string,
                secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY as string
            },
            region: process.env.AWS_SES_REGION as string
        });
    }

}