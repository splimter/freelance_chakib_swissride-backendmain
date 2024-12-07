import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

export interface IUser {
    name: string;
    email: string;
    password: string;
}
export interface IUserLogin {
    username: string;
    password: string;
}

const User = mongoose.model('User', UserSchema);

export default User;
