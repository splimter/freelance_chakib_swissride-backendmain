import DriverRepository from '../../repositories/drivers';
import RideOrderRepository from '../../repositories/ride_order';
import {DriverType, IDriver} from '../../models/driver.model';
import bcrypt from "bcrypt";
import {sendEmailAccountCreation} from "../../adapters/sendgrid_app_service";
import {sendWhatsAppCredentialsMessage, sendWhatsAppWelcomeMessage} from "../../adapters/whatsapp_app_service";
import {FastifyInstance} from "fastify";

const saltRounds = 15;

const DriverService = {
    createDriver: async (fastify: FastifyInstance, driverData: IDriver) => {
        try {
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
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    getDriverById: async (fastify: FastifyInstance, id: string) => {
        try {
            return await DriverRepository.getBy('_id', id);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    getByUsername: async (fastify: FastifyInstance, username: string) => {
        try {
            return await DriverRepository.getBy('username', username);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    getAllDrivers: async (fastify: FastifyInstance, ) => {
        try {
            return await DriverRepository.getAll();
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    updateDriver: async (fastify: FastifyInstance, id: string, driverData: IDriver) => {
        try {
            if (driverData.password) {
                driverData.password = await DriverService.generatePassword(fastify, driverData.password);
            }
            return await DriverRepository.update(id, driverData);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    deleteDriver: async (fastify: FastifyInstance, id: string) => {
        try {
            return await DriverRepository.delete(id);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    generatePassword: async (fastify: FastifyInstance, password: string) => {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    comparePassword: async (fastify: FastifyInstance, password: string, hash: string) => {
        try {
            return bcrypt.compare(password, hash);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    myRides: async (fastify: FastifyInstance, id: string, driverType: DriverType) => {
        try {
            let _entryType = "";
            if(driverType === DriverType.Primary) {
                _entryType = "primaryDriver";
            } else if(driverType === DriverType.Secondary) {
                _entryType = "secondaryDriver";
            } else if(driverType === DriverType.Tertiary) {
                _entryType = "auxDriver";
            }
            return await RideOrderRepository.getAllBy(_entryType, id);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    setEndPrice: async (fastify: FastifyInstance, userId: string, rideId: string, price: string) => {
        try {
            const ride: any = await RideOrderRepository.getById(rideId);
            if (ride === null) {
                return null;
            }
            if (ride.primaryDriver === userId.toString() || ride.secondaryDriver === userId.toString() || ride.auxDriver === userId.toString()) {
                ride.endPrice = price;
                return await RideOrderRepository.update(rideId, ride);
            }
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    }
};

export default DriverService;