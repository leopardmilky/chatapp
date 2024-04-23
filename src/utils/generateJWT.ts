import jwt from "jsonwebtoken";
import { configDotenv } from 'dotenv';
configDotenv();


export const generateAccessJWT = (email: string) => {
    const payload = { username: email };
    const expiresIn = 60 * 1;  // 1분
    const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY as string, { expiresIn: expiresIn });
    const jwtInfo = { token: token, expiresIn: expiresIn };
    return jwtInfo
}

export const generateRefreshJWT = (email: string) => {
    const payload = { username: email };
    const expiresIn = 60 * 3; // 14일
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY as string, { expiresIn: expiresIn });
    const jwtInfo = { token: token, expiresIn: expiresIn };
    return jwtInfo
}
