import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { getMySQLConnection } from '../database';


export class UserModel {
     public static async checkDuplicateEmail(email: string): Promise<boolean> {
        const mySQLConnection = getMySQLConnection();
        if (!mySQLConnection) {
            throw new Error('Database connection not established');
        }
        const [rows] = await mySQLConnection.execute<RowDataPacket[]>(
            'SELECT COUNT(*) AS count FROM users WHERE user_email = ?',
            [email]
        );
        const count: number = rows[0].count;
        return count > 0;
    }

    public static async checkDuplicatePhone(phone: string): Promise<boolean> {
        const mySQLConnection = getMySQLConnection()
        if (!mySQLConnection) {
            throw new Error('Database connection not established');
        }
        const [rows] = await mySQLConnection.execute<RowDataPacket[]>(
            'SELECT COUNT(*) AS count FROM users WHERE user_phone = ?',
            [phone]
        );
        const count: number = rows[0].count;
        return count > 0;
    }

    public static async register(email: string, phone: string, nickname: string, password: string, uuid: string): Promise<boolean> {
        const mySQLConnection = getMySQLConnection()
        if (!mySQLConnection) {
            throw new Error('Database connection not established');
        }
        const [result] = await mySQLConnection.execute<ResultSetHeader>(
            `INSERT INTO users (user_email, user_phone, user_nick, user_pwd, user_uid)
             VALUES (?,?,?,?,?)`,
            [email, phone, nickname, password, uuid]
        );
        return result.affectedRows > 0;
    }

    public static async signin(email: string) {
        const mySQLConnection = getMySQLConnection()
        if (!mySQLConnection) {
            throw new Error('Database connection not established');
        }
        const [rows] = await mySQLConnection.execute<RowDataPacket[]>(
            'SELECT user_pwd, user_uid FROM users WHERE user_email = ?',
            [email]
        );

        if(rows[0]) { return rows[0] }
        return rows[0]
    }
}