import { RequestHandler } from 'express';
import jwt from "jsonwebtoken";
import { redisConnection } from '../utils/redisClient';
import { generateAccessJWT, generateRefreshJWT } from '../utils/generateJWT';
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

export const clearJWT: RequestHandler = async(req, res, next) => {
    const { userAccessToken } = req.cookies;
    if(userAccessToken) {
        res.clearCookie("userAccessToken", { httpOnly: true });
        await redisConnection.del(userAccessToken);
        console.log("clearJWT_______working.....");
        return next();
    }
    console.log("clearJWT_______userAccessToken없음.....");
    next();
}

export const isValidJWT: RequestHandler = (req, res, next) => {
    const { userAccessToken } = req.cookies;
    jwt.verify(userAccessToken, process.env.JWT_ACCESS_SECRET_KEY as string, async(err: any, decoded: any) => {
        if(err?.name === 'TokenExpiredError') {
            const refreshToken = await redisConnection.get(userAccessToken) as string;
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY as string, async(err: any, decoded: any) => {
                if(err) { 
                    console.log("refreshToken die");
                    return res.render('pages/signin'); 
                }
                if(decoded) {
                    const decodedRefreshToken = jwt.decode(refreshToken) as { username: string };
                    const accessJWT = generateAccessJWT(decodedRefreshToken.username);
                    const refreshJWT = generateRefreshJWT(decodedRefreshToken.username);
                    await redisConnection.del(userAccessToken);
                    res.clearCookie("userAccessToken", { httpOnly: true });
                    await redisConnection.set(accessJWT.token, refreshJWT.token);
                    await redisConnection.expire(accessJWT.token, refreshJWT.expiresIn);
                    res.cookie("userAccessToken", accessJWT.token, { httpOnly: true });
                    console.log("refreshToken alive");
                    return next();
                }
            });
        }
        if(err?.name === 'JsonWebTokenError') {
            console.log("accessToken error");
            return res.render('pages/signin'); 
        }

        if(decoded) { 
            console.log("accessToken alive");
            return next();
        }
    });
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