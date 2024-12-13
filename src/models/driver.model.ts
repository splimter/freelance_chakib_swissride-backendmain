import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    password: { type: String, required: true }
});

export interface IDriver {
    username: string;
    name: string;
    email: string;
    phone_number: string;
    password: string;
}
export interface IDriverLogin {
    username: string;
    password: string;
}

const Driver = mongoose.model('Driver', UserSchema);

export default Driver;
