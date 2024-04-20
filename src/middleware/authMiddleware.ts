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

export const loginRequired: RequestHandler = (req, res, next) => {
    const { userToken } = req.cookies;
    try {
        const result = jwt.verify(userToken, process.env.JWT_SECRET_KEY as string);
        console.log("result: ", result);
    } catch(error) {
        console.log(error);
    }
    
    next();
}