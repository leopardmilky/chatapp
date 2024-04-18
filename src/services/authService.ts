import { UserModel } from '../models/user';
import bcrypt from 'bcrypt';


export class AuthService {
    async isEmailDuplicated(email: string): Promise<boolean> {
        const result = await UserModel.checkDuplicateEmail(email)
        return result
    }

    async isPhoneDuplicated(phone: string): Promise<boolean> {
        const userPhone = `+82${phone}`
        const result = await UserModel.checkDuplicatePhone(userPhone)
        return result
    }

    async register(email:string, phone: string, nickname: string, password: string): Promise<boolean> {
        const userPhone = `+82${phone}`
        const result = await UserModel.register(email, userPhone, nickname, password);
        return result;
    }

    async signin(email: string, password: string) {
        const passwordHash = await UserModel.signin(email);
        if(passwordHash) {
            const matchOrNot = await bcrypt.compare(password, passwordHash);
            return matchOrNot
        }
        return passwordHash
    }
}