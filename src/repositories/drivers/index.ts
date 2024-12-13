import Driver, { IDriver } from "../../models/driver.model";
import User from "../../models/user.model";

const DriverRepository = {
    getAll: async () => {
        try {
            return await Driver.find();
        } catch (error) {
            console.log({ error });
            return null;
        }
    },
    create: async (entity: IDriver) => {
        try {
            const driver = new Driver(entity);
            return await driver.save();
        } catch (error) {
            console.log({ error });
            return null;
        }
    },
    getBy: async (field: string, value: string) => {
        try {
            return await Driver.findOne({[field as any]: value});
        } catch (error) {
            console.log({error})
            return null;
        }
    },
    update: async (id: string, entity: IDriver) => {
        try {
            return await Driver.findByIdAndUpdate(id, entity, { new: true });
        } catch (error) {
            console.log({ error });
            return null;
        }
    },
    delete: async (id: string) => {
        try {
            return await Driver.findByIdAndDelete(id);
        } catch (error) {
            console.log({ error });
            return null;
        }
    }
};

export default DriverRepository;