import * as mongoose from "mongoose";

export enum DriverType {
    Primary = 'primary',
    Secondary = 'secondary',
    Tertiary = 'tertiary'
}

const DriverSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    type: { type: String, required: true, default: DriverType.Primary }
});

export interface IDriver {
    username: string;
    name: string;
    email: string;
    phone_number: string;
    password: string;
    role: string;
    type: string;
}
export interface IDriverLogin {
    username: string;
    password: string;
}

const Driver = mongoose.model('Driver', DriverSchema);

export default Driver;
