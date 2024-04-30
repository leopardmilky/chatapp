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

    async register(email:string, phone: string, nickname: string, password: string, uuid: string): Promise<boolean> {
        const userPhone = `+82${phone}`
        const result = await UserModel.register(email, userPhone, nickname, password, uuid);
        return result;
    }

    async signin(email: string, password: string) {
        const pwdNuid = await UserModel.signin(email);
        if(pwdNuid) {
            const matchOrNot = await bcrypt.compare(password, pwdNuid.user_pwd);
            if(matchOrNot) {
                return pwdNuid.user_uid;
            } else {
                return matchOrNot
            }
        }
        return false
    }
}