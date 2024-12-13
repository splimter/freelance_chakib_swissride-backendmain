import RideOrder , {IRideOrder} from "../../models/ride_order.model";
import User from "../../models/user.model";


const RideOrderRepository = {
    getBy: async (field: string, value: string) => {
        try {
            const req: any = RideOrder.findOne({[field as any]: value});
            return await req;
        } catch (error) {
            console.log({error})
            return null;
        }
    },
    getAllBy: async (field: string, value: string) => {
        try {
            const req: any = RideOrder.find({[field as any]: value});
            return await req;
        } catch (error) {
            console.log({error})
            return null;
        }
    },
    getAll: async () => {
        try {
            return await RideOrder.find();
        } catch (error) {
            console.log({error})
            return null;
        }
    },
    create: async (entity: IRideOrder) => {
        try {
            const rideOrder = new RideOrder(entity);
            return await rideOrder.save();
        } catch (error) {
            console.log({error})
            return null;
        }
    },
    getById: async (id: string) => {
        try {
            return await RideOrder.findById(id);
        } catch (error) {
            console.log({error})
            return null;
        }
    },
    update: async (id: string, entity: IRideOrder) => {
        try {
            return await RideOrder.findByIdAndUpdate(id, entity, { new: true });
        } catch (error) {
            console.log({ error });
            return null;
        }
    },
    delete: async (id: string) => {
        try {
            return await RideOrder.findByIdAndDelete(id);
        } catch (error) {
            console.log({ error });
            return null;
        }
    },
    updateState: async (id: string, state: string) => {
        try {
            return await RideOrder.findByIdAndUpdate(id, {state}, {new: true});
        } catch (error) {
            console.log({error})
            return null;
        }
    }
}

export default RideOrderRepository;