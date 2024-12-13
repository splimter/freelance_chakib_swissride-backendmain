import DriverRepository from '../../repositories/drivers';
import { IDriver } from '../../models/driver.model';
import bcrypt from "bcrypt";

const saltRounds = 15;

const DriverService = {
    createDriver: async (driverData: IDriver) => {
        driverData.password = await DriverService.generatePassword(driverData.password);
        return await DriverRepository.create(driverData);
    },
    getDriverById: async (id: string) => {
        return await DriverRepository.getBy('_id',id);
    },
    getByUsername: async (username: string) => {
        return await DriverRepository.getBy('username', username);
    },
    getAllDrivers: async () => {
        return await DriverRepository.getAll();
    },
    updateDriver: async (id: string, driverData: IDriver) => {
        return await DriverRepository.update(id, driverData);
    },
    deleteDriver: async (id: string) => {
        return await DriverRepository.delete(id);
    },
    generatePassword: async (password: string) => {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    },
    comparePassword: async (password: string, hash: string) => {
        return bcrypt.compare(password ,hash);
    }
};

export default DriverService;