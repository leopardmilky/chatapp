import mysql, { Connection } from 'mysql2/promise';
import { configDotenv } from 'dotenv';
configDotenv();


let mySqlConnection: Connection;

export const connectMySQL = async(): Promise<void> => {
    try{
        mySqlConnection = await mysql.createConnection({
            host: process.env.AWS_RDS_HOST,
            user: process.env.AWS_RDS_USER,
            database: process.env.AWS_RDS_DATABASE,
            password: process.env.AWS_RDS_PASSWORD
        });
        console.log('MySQL database connected');
    } catch(e) {
        console.error('Unable to connect to the MySQL database:', e);
    }
}

export const getMySQLConnection = (): Connection => {
    return mySqlConnection;
}

// 클래스 형태로 만드는건 어떨까