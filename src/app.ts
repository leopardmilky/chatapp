import authRoutes from './routes/authRoutes';
import { connectMySQL } from './database';
import session, { SessionOptions } from 'express-session';
import path from "path";
import express from 'express';
import nocache from 'nocache';
import cookieParser  from 'cookie-parser';
import { configDotenv } from 'dotenv';
configDotenv();


class App {
    public app: express.Application

    constructor() {
        this.app = express();
        this.config();
        this.listen();
        this.routes();
        this.connectDatabases();
    }

    private listen(): void {
        this.app.listen(process.env.EXPRESS_PORT, () => console.log(`connected PORT ${process.env.EXPRESS_PORT} ~ ♡`))
    }

    private config(): void {
        this.app.use(express.static(path.join(__dirname, '../views/static')));
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, '../views'));
        this.app.use(express.urlencoded({ extended: true}));
        this.app.use(express.json());
        this.app.use(session(this.sessionConfig()));
        this.app.use(nocache());
        this.app.use(cookieParser());
    }

    private routes(): void {
        this.app.use('/api/auth', authRoutes);
    }

    private connectDatabases(): void {
        connectMySQL();
    }

    private sessionConfig() {
        const sessionConfig: SessionOptions = {
            secret: 'iamsecretsession',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                maxAge: 1000 * 60 * 60
            }
        }
        return sessionConfig;
    }
}

export default new App().app;