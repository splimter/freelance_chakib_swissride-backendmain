import dotenv from 'dotenv';
import * as process from "node:process";

dotenv.config();

export default {
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    MONGO_DB_URL: process.env.MONGO_DB_URL,
    MONGO_DB_CLUSTER: process.env.MONGO_DB_CLUSTER,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    MONGO_DB_USERNAME: process.env.MONGO_DB_USERNAME,
    MONGO_DB_PASSWORD: process.env.MONGO_DB_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
}