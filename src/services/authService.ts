import { UserModel } from '../models/user';



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

}