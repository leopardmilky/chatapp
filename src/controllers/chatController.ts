import { RequestHandler } from 'express';



export const chatHome: RequestHandler = (req, res) => {
    console.log("chatHome작동함.")
    res.render('pages/chat');
};