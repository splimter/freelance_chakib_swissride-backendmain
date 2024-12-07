import RideOrder , {IRideOrder} from "../../models/ride_order.model";


const RideOrderRepository = {
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