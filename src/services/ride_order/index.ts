import { FastifyInstance } from 'fastify';
import RideOrderRepository from "../../repositories/ride_order";
import { IRideOrder, RideOrderState } from "../../models/ride_order.model";
import {sendWhatsAppNewRideOrderMessage, sendWhatsAppUpdateRideOrderMessage} from "../../adapters/whatsapp_app_service";
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
                const driver = await DriverService.getDriverById(fastify, rideOrder.primaryDriver);
                console.log({driver});
                if (driver) {
                    try {
                        await sendWhatsAppNewRideOrderMessage(driver.phone_number, driver.name, rideOrder);
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
            const existingRideOrder: IRideOrder = await RideOrderRepository.getById(id);
            if (!existingRideOrder) {
                return null;
            }
            const updatedRecord = await RideOrderRepository.update(id, rideOrder);
            if(existingRideOrder.primaryDriver === null && rideOrder.primaryDriver){
                const driver = await DriverService.getDriverById(fastify, rideOrder.primaryDriver);
                if (driver) {
                    await sendWhatsAppNewRideOrderMessage(driver.phone_number, driver.name, rideOrder);
                }
            } else if (existingRideOrder.primaryDriver) {
                if(existingRideOrder.primaryDriver !== rideOrder.primaryDriver) {
                    const driver = await DriverService.getDriverById(fastify, rideOrder.primaryDriver);
                    if (driver) {
                        await sendWhatsAppNewRideOrderMessage(driver.phone_number, driver.name, rideOrder);
                    }
                } else {
                    const driver = await DriverService.getDriverById(fastify, existingRideOrder.primaryDriver);
                    if (driver) {
                        await sendWhatsAppUpdateRideOrderMessage(driver.phone_number, driver.name, existingRideOrder, rideOrder);
                    }
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