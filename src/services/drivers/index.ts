import DriverRepository from '../../repositories/drivers';
import RideOrderRepository from '../../repositories/ride_order';
import {IDriver} from '../../models/driver.model';
import bcrypt from "bcrypt";
import {sendEmailAccountCreation} from "../../adapters/sendgrid_app_service";
import {sendWhatsAppCredentialsMessage, sendWhatsAppWelcomeMessage} from "../../adapters/whatsapp_app_service";
import {FastifyInstance} from "fastify";

const saltRounds = 15;

const DriverService = {
    createDriver: async (fastify: FastifyInstance, driverData: IDriver) => {
        const oldPassword = driverData.password;
        driverData.password = await DriverService.generatePassword(fastify, driverData.password);
        driverData.role = 'driver';
        const driver: any = await DriverRepository.create(driverData);
        driver.emailStatus = sendEmailAccountCreation(driverData.email, driverData.username, oldPassword);
        await sendWhatsAppWelcomeMessage(driverData.phone_number);
        await sendWhatsAppCredentialsMessage(driverData.phone_number, driverData.name, {
            username: driverData.username,
            password: oldPassword
        });
        return driver;
    },
    getDriverById: async (fastify: FastifyInstance, id: string) => {
        return await DriverRepository.getBy('_id',id);
    },
    getByUsername: async (fastify: FastifyInstance, username: string) => {
        return await DriverRepository.getBy('username', username);
    },
    getAllDrivers: async (fastify: FastifyInstance, ) => {
        return await DriverRepository.getAll();
    },
    updateDriver: async (fastify: FastifyInstance, id: string, driverData: IDriver) => {
        if (driverData.password) {
            driverData.password = await DriverService.generatePassword(fastify, driverData.password);
        }
        return await DriverRepository.update(id, driverData);
    },
    deleteDriver: async (fastify: FastifyInstance, id: string) => {
        return await DriverRepository.delete(id);
    },
    generatePassword: async (fastify: FastifyInstance, password: string) => {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    },
    comparePassword: async (fastify: FastifyInstance, password: string, hash: string) => {
        return bcrypt.compare(password ,hash);
    },
    myRides: async (fastify: FastifyInstance, id: string) => {
        const primary = await RideOrderRepository.getAllBy("primaryDriver", id);
        const secondary = await RideOrderRepository.getAllBy("secondaryDriver", id);
        const aux = await RideOrderRepository.getAllBy("auxDriver", id);
        return  {
            primary,
            secondary,
            aux
        }
    },
    setEndPrice: async (fastify: FastifyInstance, userId: string, rideId: string, price: string) => {
        const ride: any = await RideOrderRepository.getById(rideId);
        if (ride === null) {
            return null;
        }
        if (ride.primaryDriver === userId.toString() || ride.secondaryDriver === userId.toString() || ride.auxDriver === userId.toString()) {
            ride.endPrice = price;
            return await RideOrderRepository.update(rideId, ride);
        }
    }
};

export default DriverService;