import mongoose from 'mongoose';
import dotenv from 'dotenv';

mongoose.Promise = global.Promise;

dotenv.config();
const MONGO_URL = process.env.MONGO_URL;


export default function connection() {

    const connect = () => {
        mongoose
            .connect(`${MONGO_URL}`)
            .then(() => console.log('Successfully connected to mongodb'))
            .catch(e => console.error(e));
    }
    connect();

    mongoose.connection.on('error', (error) => {
        console.log(`���� ��� ���� ���� : ${error}`)
    });

    mongoose.connection.on('disconnected', () => {
        console.log(`���� ��� ������ ���������ϴ� . `);
        connect();
    });
}
