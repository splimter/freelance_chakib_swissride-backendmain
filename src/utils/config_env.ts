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
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN,
    PHONE_NUMBER_ID: process.env.PHONE_NUMBER_ID,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    MESSAGING_SERVICE_SID: process.env.MESSAGING_SERVICE_SID,
}