import { RequestHandler } from 'express';
import jwt from "jsonwebtoken";
import { redisConnection } from '../utils/redisClient';
import { configDotenv } from 'dotenv';
configDotenv();

export const checkSignupStep2Permission: RequestHandler = (req, res, next) => {
    if(req.session.signupStep2) {
        next();
    } else {
        res.redirect('/api/auth/signup-step1');
    }
}

export const checkSignupStep3Permission: RequestHandler = (req, res, next) => {
    if(req.session.signupStep3) {
        next();
    } else {
        res.redirect('/api/auth/signup-step1');
    }
}

export const checkPasswordMatch: RequestHandler = (req, res, next) => {
    const { password, confirmPassword } = req.body;
    if(password.length >= 8 && confirmPassword.length >= 8) {
        const result = password === confirmPassword;
        if(result) {
            return next();
        } else {
            return res.json('nomatch');
        }
    }
    res.json('needmore');
}

export const checkAccessJWT: RequestHandler = (req, res, next) => {
    /*
    엑세스 토큰을 확인하고 유효하다면 패스한다.
    엑세스 토큰을 확인하고 만료되었다면, 리프레시 토큰에서 엑세스 토큰과 리프레시 토큰을 재발급 받아야한다.
    */

    const { userAccessToken } = req.cookies;
    try {
        const result = jwt.verify(userAccessToken, process.env.JWT_ACCESS_SECRET_KEY as string);
        console.log("userAccessToken_result: ", result);
    } catch(error) {
        console.log(error);
    }
    next();
}

export const createRefreshJWT: RequestHandler = (req, res, next) => {
    /*
    엑세스 토큰이 유효하다면 리프레시 토큰만 재발급하고,
    엑세스 토큰이 만료되었으면 엑세스 토큰과 리프레시 토큰을 재발급한다.
    리프레시 토큰도 만료되었다면 재로그인을 요구해야한다.
    */
    const { userRefreshToken } = req.cookies;
    try {
        const result = jwt.verify(userRefreshToken, process.env.JWT_REFRESH_SECRET_KEY as string);
        console.log("userRefreshToken_result: ", result);
    } catch(error) {
        console.log(error);
    }
    next();
}

export const isValidJWT: RequestHandler = (req, res, next) => {
    // 엑세스 토큰은 쿠키, 리프레시 토큰은 레디스로
    // 페이지 접속 했을때, 로그아웃을 안해서 엑세스 토큰이 살아있는지 미들웨어에서 확인하고 리프레시 토큰 갱신하고, 바로 로그인된 페이지로 이동.

    const { userAccessToken } = req.cookies;
    console.log("userAccessToken: ", userAccessToken);
    console.log("req.cookies: ", req.cookies);
    // const isValidAccessToken = jwt.verify(userAccessToken, process.env.JWT_ACCESS_SECRET_KEY as string);
    // console.log("isValidAccessToken: ", isValidAccessToken);
    // const header = req.headers;
    // const header2 = req.headers['authorization'];
    // const header3 = req.headers['Authorization'];
    // console.log("headers: ", header);
    // console.log("headers@@: ", header2);
    // console.log("headers@@@: ", header3);
    next();

}

export const isValidEmail: RequestHandler = (req, res, next) => {
    const { email } = req.body;
    const emailRegExp = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
    const isValidEmail = emailRegExp.test(email);
    if(!isValidEmail) {
        return res.json(true);
    }
    return next();
}

export const isValidInput: RequestHandler = async (req, res, next) => {
    const { code, inputtedEmail } = req.body;
    const requestedEmail = req.session.emailVerification;
    if(inputtedEmail.trim() === '' || requestedEmail === undefined || inputtedEmail !== requestedEmail) {
        return res.json('incorrect');
    }

    const value = await redisConnection.get(requestedEmail);
    if(value !== code) {
        return res.json(false);
    }
    return next();
}

export const deleteVerificationSession: RequestHandler = async (req, res, next) => {
    delete req.session.emailVerification;
    delete req.session.phoneVerification;
    next();
}