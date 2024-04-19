import express from 'express';
import { renderSignin, signin, renderEmailVerification, renderPhoneVerification, 
    renderInputUserInfo, sendEmailCode, emailVerification,
    sendPhoneCode, phoneVerification, register } from '../controllers/authController';
import { checkSignupStep2Permission, checkSignupStep3Permission, 
    checkPasswordMatch, loginRequired } from '../middleware/authMiddleware';
const router = express.Router();


router.get('/', (req, res) => {
    res.redirect('/signin');
});

router.get('/signin', renderSignin);
router.post('/signin',loginRequired, signin);
router.get('/signup-step1', renderEmailVerification);
router.get('/signup-step2', checkSignupStep2Permission, renderPhoneVerification);
router.get('/signup-step3', checkSignupStep3Permission, renderInputUserInfo);
router.post('/send-email-code', sendEmailCode);
router.post('/email-verification', emailVerification);
router.post('/send-phone-code', sendPhoneCode);
router.post('/phone-verification', phoneVerification);
router.post('/register', checkPasswordMatch, register);

export default router;