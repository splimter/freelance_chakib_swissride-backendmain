import { FastifyInstance } from 'fastify';
import RideOrderRepository from "../../repositories/ride_order";
import { IRideOrder, RideOrderState } from "../../models/ride_order.model";
import {sendWhatsAppNewRideOrderMessage} from "../../adapters/whatsapp_app_service";
import DriverService from "../drivers";

const RideOrderService = {
    getAll: async (fastify: FastifyInstance) => {
        try {
            return await RideOrderRepository.getAll();
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    getById: async (fastify: FastifyInstance, id: string) => {
        try {
            return await RideOrderRepository.getById(id);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    create: async (fastify: FastifyInstance, rideOrder: IRideOrder) => {
        try {
            const id = await RideOrderRepository.create(rideOrder);
            if(rideOrder.primaryDriver){
                const driver = await DriverService.getDriverById(rideOrder.primaryDriver);
                console.log({driver});
                if (driver) {
                    try {
                        await sendWhatsAppNewRideOrderMessage(driver.phone_number, driver.name, {
                            name: rideOrder.fullname,
                            date: rideOrder.date,
                            pickup: rideOrder.pickup,
                            goingto: rideOrder.goingto,
                            email: rideOrder.email,
                            phone: rideOrder.phone
                        });
                    } catch (error) {
                        fastify.log.error(error);
                    }
                }
            }
            return id;
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    updateState: async (fastify: FastifyInstance, id: string, state: RideOrderState) => {
        try {
            const rideOrder = await RideOrderRepository.getById(id);
            if (!rideOrder) {
                return null;
            }
            return await RideOrderRepository.updateState(id, state);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    update: async (fastify: FastifyInstance, id: string, rideOrder: IRideOrder) => {
        try {
            const existingRideOrder = await RideOrderRepository.getById(id);
            if (!existingRideOrder) {
                return null;
            }
            const updatedRecord = await RideOrderRepository.update(id, rideOrder);
            if(existingRideOrder.primaryDriver){
                const driver = await DriverService.getDriverById(existingRideOrder.primaryDriver);
                if (driver) {
                    await sendWhatsAppNewRideOrderMessage(driver.phone_number, driver.name, {
                        name: rideOrder.fullname,
                        date: rideOrder.date,
                        pickup: rideOrder.pickup,
                        goingto: rideOrder.goingto,
                        email: rideOrder.email,
                        phone: rideOrder.phone
                    });
                }
            }
            return updatedRecord;
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    delete: async (fastify: FastifyInstance, id: string) => {
        try {
            const existingRideOrder = await RideOrderRepository.getById(id);
            if (!existingRideOrder) {
                return null;
            }
            return await RideOrderRepository.delete(id);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    }
};

export default RideOrderService;