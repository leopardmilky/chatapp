import jwt from "jsonwebtoken";
import { configDotenv } from 'dotenv';
configDotenv();


interface Payload {
    email: string;
}

export const generateToken = (payload: Payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string)
    return token
}


