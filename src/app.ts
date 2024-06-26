import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import { connectMySQL } from './database';
import session, { SessionOptions } from 'express-session';
import { isValidJWT, clearJWT } from './middleware/authMiddleware';
import path from "path";
import express from 'express';
import nocache from 'nocache';
import cors from 'cors';
import cookieParser  from 'cookie-parser';
import http from 'http';
import socketio from 'socket.io';
import { configDotenv } from 'dotenv';
configDotenv();


export class App {
    public app: express.Application;
    private server: http.Server;
    private io: socketio.Server;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new socketio.Server(this.server);
        this.config();
        this.commonMiddleware();
        this.routes();
        this.connectDatabases();
        this.handleSocketConnections()
        this.listen();
    }

    private listen(): void {
        // this.app.listen(process.env.EXPRESS_PORT, () => console.log(`connected PORT ${process.env.EXPRESS_PORT} ~ ♡`));
        this.server.listen(process.env.EXPRESS_PORT, () => console.log(`connected PORT ${process.env.EXPRESS_PORT} ~ ♡`));
    }

    private config(): void {
        this.app.use(express.static(path.join(__dirname, '../views/static')));
        this.app.set('views', path.join(__dirname, '../views'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true}));
        this.app.set('view engine', 'ejs');
        this.app.use(session(this.sessionConfig()));
        // this.app.use(cors({origin: true}));
        this.app.use(cookieParser());
        this.app.use(nocache());
        this.app.disable('x-powered-by');
    }

    private commonMiddleware(): void {
        this.app.use((req, res, next) => {
            if(req.path.startsWith('/api/auth/')) return next();
            isValidJWT(req, res, next);
        });
        
        this.app.use((req, res, next) => {
            if(req.path.startsWith('/api/auth/')) return clearJWT(req, res, next);
            next();
        });
    }

    private routes(): void {
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/chat', chatRoutes);
    }

    private connectDatabases(): void {
        connectMySQL();
    }

    private sessionConfig() {
        const sessionConfig: SessionOptions = {
            secret: process.env.SESSION_SECRET as string,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                maxAge: 1000 * 60 * 60
            }
        }
        return sessionConfig;
    }

    handleSocketConnections(): void {
        this.io.on('connection', (socket: socketio.Socket) => {
            console.log('socketio에 연결되었습니다.');

            socket.on('disconnect', () => {
                console.log('socketio와 연결해제 되었습니다.');
            });

            socket.on('chat message', (msg: string) => {
                console.log(`메세지: ${msg}`);
                this.io.emit('chat message', msg);  // 모든 클라이언트에세 메세지 전달.
            });
        });
    };
}

export default new App().app;