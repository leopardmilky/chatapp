import { RequestHandler } from 'express';
import { AuthService } from '../services/authService';
import { redisConnection } from '../utils/redisClient';
import { AwsSns } from '../utils/awsSNS';
import { AwsSes } from '../utils/awsSES';
import { generateAccessJWT, generateRefreshJWT } from '../utils/generateJWT';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { configDotenv } from 'dotenv';
configDotenv();

const authService = new AuthService();
const awsSns = new AwsSns();
const awsSes = new AwsSes();

export const renderSignin: RequestHandler = (req, res) => {
    // console.log("req.headers: ", req.headers);
    // console.log("req.cookies: ", req.cookies);
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
    const { email, pwd } = req.body;
    const uuidExists = await authService.signin(email, pwd);
    if(uuidExists) {
        const accessJWT = generateAccessJWT(uuidExists);
        const refreshJWT = generateRefreshJWT(uuidExists);

        await redisConnection.set(accessJWT.token, refreshJWT.token);
        await redisConnection.expire(accessJWT.token, refreshJWT.expiresIn);
        res.cookie("userAccessToken", accessJWT.token, { httpOnly: true });
        console.log("로그인 성공~~~~~~~~~~~~");
        // return res.render('pages/home');
        return res.redirect('/api/chat');
    }
    return res.json(uuidExists);
}

export const sendEmailCode: RequestHandler = async (req, res) => {
    const { email } = req.body;
    const result = await authService.isEmailDuplicated(email);
    if(!result) {
        const randomString = Math.random().toString(36).slice(-6);
        awsSes.sendEmail([email], '[LeoStudy]이메일 인증 코드입니다.', `LeoStudy 인증코드: ${randomString}`);
        await redisConnection.set(email, randomString);
        await redisConnection.expire(email, 180);
        req.session.emailVerification = email;
    }
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
        // console.log("randomNumber: ", randomNumber);
        awsSns.sendMessage(`+82${phone}`, `LeoStudy 인증코드: ${randomNumber}`);
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
    const uuid = uuidv4();
    console.log("userUUID: ", uuid);
    const result = await authService.register(email, phone, newNickname, hashingResult, uuid);
    if(result) {
        return res.json("ok");
    }
    return res.json("server error");    // 에러핸들링 구성.
}