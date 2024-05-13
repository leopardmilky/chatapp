import { RequestHandler } from 'express';
// import { chatApp } from '../chatApp';
import { App } from '../app';


export const activateChatApp: RequestHandler = (req, res, next) => {
    // new chatApp();
    // const app = new App();
    // app.handleSocketConnections();
    next();
};