import express from 'express';
import { chatHome } from '../controllers/chatController';
import { activateChatApp } from '../middleware/chatMiddleware';
const router = express.Router();


router.get('/', activateChatApp, chatHome);


export default router;