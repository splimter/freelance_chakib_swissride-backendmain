import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
});

export interface IUser {
    username: string;
    name: string;
    email: string;
    phone_number: string;
    password: string;
    role: string;
}
export interface IUserLogin {
    username: string;
    password: string;
}

const User = mongoose.model('User', UserSchema);

export default User;
