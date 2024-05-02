import express from 'express';
import { renderSignin, signin, renderEmailVerification, renderPhoneVerification, 
    renderInputUserInfo, sendEmailCode, emailVerification,
    sendPhoneCode, phoneVerification, register } from '../controllers/authController';
import { checkSignupStep2Permission, checkSignupStep3Permission, 
    checkPasswordMatch, isValidJWT, isValidEmail, isValidInput, 
    deleteVerificationSession } from '../middleware/authMiddleware';
const router = express.Router();

router.get('/signin', renderSignin);
router.post('/signin', signin);
router.get('/signup-step1', deleteVerificationSession, renderEmailVerification);
router.get('/signup-step2', checkSignupStep2Permission, renderPhoneVerification);
router.get('/signup-step3', checkSignupStep3Permission, renderInputUserInfo);
router.post('/send-email-code', isValidEmail, sendEmailCode);
router.post('/email-verification', isValidInput, emailVerification);
router.post('/send-phone-code', sendPhoneCode);
router.post('/phone-verification', phoneVerification);
router.post('/register', checkPasswordMatch, register);
router.post('/signout', renderSignin);

export default router;