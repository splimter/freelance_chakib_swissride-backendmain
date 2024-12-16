import RideOrder , {IRideOrder} from "../../models/ride_order.model";
import User from "../../models/user.model";


const RideOrderRepository = {
    getBy: async (field: string, value: string) => {
        const req: any = RideOrder.findOne({[field as any]: value});
        return await req;
    },
    getAllBy: async (field: string, value: string) => {
        const req: any = RideOrder.find({[field as any]: value});
        return await req;
    },
    getAll: async () => {
        return RideOrder.find();
    },
    create: async (entity: IRideOrder) => {
        const rideOrder = new RideOrder(entity);
        return await rideOrder.save();
    },
    getById: async (id: string) => {
        return RideOrder.findById(id);
    },
    update: async (id: string, entity: IRideOrder) => {
        return RideOrder.findByIdAndUpdate(id, entity, { new: true });
    },
    delete: async (id: string) => {
        return RideOrder.findByIdAndDelete(id);
    },
    updateState: async (id: string, state: string) => {
        return RideOrder.findByIdAndUpdate(id, {state}, {new: true});
    }
}

export default RideOrderRepository;