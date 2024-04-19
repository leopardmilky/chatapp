import { RequestHandler } from 'express';
import { AuthService } from '../services/authService';
import { redisConnection } from '../utils/redisClient';
import { AwsSns } from '../utils/awsSNS';
import { generateToken } from '../utils/signJWT';
import bcrypt from 'bcrypt';
import { configDotenv } from 'dotenv';
configDotenv();

const authService = new AuthService();
const awsSns = new AwsSns();

export const renderSignin: RequestHandler = (req, res) => {
    res.render('pages/signin');
}

export const renderEmailVerification: RequestHandler = (req, res) => {
    res.render('pages/signup/emailVerification');
}

export const renderPhoneVerification: RequestHandler = (req, res) => {
    delete req.session.signupStep2;
    res.render('pages/signup/phoneVerification');
}

export const renderInputUserInfo: RequestHandler = (req, res) => {
    delete req.session.signupStep3;
    res.render('pages/signup/inputUserInfo');
}

export const signin: RequestHandler = async (req, res) => {
    const { email, password } = req.body;
    const isauthenticated = await authService.signin(email, password);
    if(isauthenticated) {
        const token = generateToken(email);
        console.log("Controller_token: ", token);
        // req.cookies("iamToken", token, {httpOnly: true});
        return token
    }
    return res.json(isauthenticated);
}

export const sendEmailCode: RequestHandler = async (req, res) => {
    const { email } = req.body;
    
    const randomString = Math.random().toString(36).slice(-6);
    console.log("randomString: ", randomString);

    const result = await authService.isEmailDuplicated(email);
    await redisConnection.set(email, '11223333');
    await redisConnection.expire(email, 180);
    req.session.emailVerification = email;
    res.json(result);
}

export const emailVerification: RequestHandler = async (req, res) => {
    const { code } = req.body;
    const email = req.session.emailVerification;
    const value = await redisConnection.get(email);
    if(value === code){
        req.session.signupStep2 = true;
        return res.json(true);
    }
    return res.json(false);
}

export const sendPhoneCode: RequestHandler = async (req, res) => {
    const { phone } = req.body;
    const result = await authService.isPhoneDuplicated(phone);
    if(!result) {
        const randomNumber = Math.random().toString().slice(-6);
        console.log("randomNumber: ", randomNumber);
        awsSns.sendMessage(phone, randomNumber);
        await redisConnection.set(phone, randomNumber);
        await redisConnection.expire(phone, 180);
        req.session.phoneVerification = phone;
    }
    res.json(result);
}

export const phoneVerification: RequestHandler = async (req, res) => {
    const { code } = req.body;
    const phone = req.session.phoneVerification;
    const value = await redisConnection.get(phone);
    if(value === code){
        req.session.signupStep3 = true;
        return res.json(true);
    }
    return res.json(false);
}

export const register: RequestHandler = async (req, res) => {
    const { newNickname, password } = req.body;
    const email = req.session.emailVerification;
    const phone = req.session.phoneVerification;
    delete req.session.emailVerification;
    delete req.session.phoneVerification;
    if(email === undefined || phone === undefined) {
        return res.json('notok');
    }
    const saltRounds = 10;
    const hashingResult = await bcrypt.hash(password, saltRounds);
    const result = await authService.register(email, phone, newNickname, hashingResult);
    if(result) {
        return res.json("ok");
    }
    return res.json("server error");    // 에러핸들링 구성.
}