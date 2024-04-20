import jwt from "jsonwebtoken";
import { configDotenv } from 'dotenv';
configDotenv();


export const generateJWT = (email: string) => {
    const payload = { username: email };
    const expiresIn = 3600;
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, { expiresIn: expiresIn });
    const jwtInfo = { token: token, expiresIn: expiresIn };
    return jwtInfo
}


