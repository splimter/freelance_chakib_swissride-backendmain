import * as mongoose from "mongoose";


export enum RideOrderState {
    Pending = 'pending',
    Accepted = 'accepted',
    InProgress = 'inProgress',
    Done = 'done',
    Rejected = 'rejected'
}

const RideOrderSchema = new mongoose.Schema({
    type: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    pickup: { type: String, required: true },
    goingto: { type: String, required: true },
    vehicle: { type: String },
    notes: { type: String },
    sendVia: { type: String },
    endPrice: { type: String },
    state: { type: String, required: true, default: RideOrderState.Pending },
    primaryDriver: { type: String },
    secondaryDriver: { type: String },
    auxDriver: { type: String },
});

export interface IRideOrder {
    state: RideOrderState;
    type: string;
    fullname: string;
    email?: string;
    phone: string;
    date: string;
    pickup: string;
    goingto: string;
    vehicle?: string;
    notes?: string;
    endPrice?: string;
    sendVia: 'email' | 'whatsapp' | null;
    primaryDriver?: string;
    secondaryDriver?: string;
    auxDriver?: string;
}

const RideOrder = mongoose.model('RideOrders', RideOrderSchema);

export default RideOrder;
