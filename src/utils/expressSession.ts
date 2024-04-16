
declare module 'express-session' {
    interface SessionData {
        emailVerification: any;
        phoneVerification: any;
        signupStep2: boolean;
        signupStep3: boolean;
    }
}