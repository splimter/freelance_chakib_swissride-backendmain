import Driver, { IDriver } from "../../models/driver.model";

const DriverRepository = {
    getAll: async () => {
        return Driver.find();
    },
    create: async (entity: IDriver) => {
        const driver = new Driver(entity);
        return await driver.save();
    },
    getBy: async (field: string, value: string) => {
        return Driver.findOne({[field as any]: value});
    },
    update: async (id: string, entity: IDriver) => {
        return Driver.findByIdAndUpdate(id, entity, { new: true });
    },
    delete: async (id: string) => {
        return Driver.findByIdAndDelete(id);
    }
};

export default DriverRepository;