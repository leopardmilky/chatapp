import express from "express";
import path from "path";
import dotenv from "dotenv";
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SESClient, SendEmailCommand} from '@aws-sdk/client-ses'
import bcrypt from 'bcrypt';
dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, '../views/static')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));


const saltRounds = 10;
const pwd = 'impassword'
const hashing = async () => {
    await bcrypt.hash(pwd, saltRounds, (err, res) => {
        if(err) {
            console.log("ERR@@@: ", err);
            return
        }
        console.log("hash_RESULT: ", res);
        comparePwd(res);
    });
    
}
// hashing();


function comparePwd(res: string) {
    bcrypt.compare(pwd, res, (err, res) => {
        if(err) {
            console.log(err);
            return
        }
        console.log("compare_RESULT: ", res);
    })
}




const snsClient = new SNSClient({
    credentials: {
        accessKeyId: process.env.AWS_SNS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY as string
    },
    region: process.env.AWS_SNS_REGION as string
});

const sesClient = new SESClient({
    credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY as string
    },
    region: process.env.AWS_SES_REGION as string
});


const sendEmail = async () => {
    const input = {
        Source: "",
        Destination: {
            ToAddresses: [ "" ] 
        },
        Message: {
            Subject: { Data: "" },
            Body: { 
                Text: { Data: "" } 
            }
        }
    }

    const command = new SendEmailCommand(input);
    const response = await sesClient.send(command);
    console.log('sendEmailCommand_response: ', response);
};
// sendEmail();


const sendOTP = async () => {
    const input = { // PublishInput
        PhoneNumber: "",
        Message: "Test MESSAGE by Leo", // required
    };
    
    const command = new PublishCommand(input);
    const response = await snsClient.send(command);
    console.log('sendOTP_response: ', response);
};
// sendOTP();



app.listen(3000, () => console.log("connected PORT 3000~~"));