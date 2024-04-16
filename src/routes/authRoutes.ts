import express from 'express';
import { signin, renderEmailVerification, renderPhoneVerification, 
    renderInputUserInfo, sendEmailCode, emailVerification,
    sendPhoneCode, phoneVerification, register } from '../controllers/authController';
import { checkSignupStep2Permission, checkSignupStep3Permission, 
    checkPasswordMatch } from '../middleware/authMiddleware';
const router = express.Router();


router.get('/', (req, res) => {
    res.redirect('/signin');
});

router.get('/signin', signin);
router.get('/signup-step1', renderEmailVerification);
router.get('/signup-step2', checkSignupStep2Permission, renderPhoneVerification);
router.get('/signup-step3', checkSignupStep3Permission, renderInputUserInfo);
router.post('/send-email-code', sendEmailCode);
router.post('/email-verification', emailVerification);
router.post('/send-phone-code', sendPhoneCode);
router.post('/phone-verification', phoneVerification);
router.post('/register', checkPasswordMatch, register);

export default router;