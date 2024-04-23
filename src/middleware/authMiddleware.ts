import { RequestHandler } from 'express';
import jwt from "jsonwebtoken";
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
    // 위에 두 개 합치는게 나을 듯.
    // 토큰 관리도 바꿔야 할 듯함. 엑세스 토큰은 로컬에 저장하고, 리프레시 토큰은 쿠키에 저장하는 방식으로 하는 걸로.

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