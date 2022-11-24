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
        console.log(`몽고 디비 연결 실패 : ${error}`)
    });

    mongoose.connection.on('disconnected', () => {
        console.log(`몽고 디비 연결이 끊어졌습니다 . `);
        connect();
    });
}
