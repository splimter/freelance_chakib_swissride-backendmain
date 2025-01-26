import { FastifyInstance } from 'fastify';
import RideOrderRepository from "../../repositories/ride_order";
import { IRideOrder, RideOrderState } from "../../models/ride_order.model";
import {sendWhatsAppNewRideOrderMessage, sendWhatsAppUpdateRideOrderMessage} from "../../adapters/whatsapp_app_service";
import DriverService from "../drivers";
import {sendEmailOrderCreated} from "../../adapters/sendgrid_app_service";
import {sendSMSNotificationConfirmOrderMessage} from "../../adapters/twilio_app_service";

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

            if (rideOrder.sendVia !== null){
                //TODO rideOrder.phone
                const nums = ["+41764418060", "+41798882240", "+41798665744"]
                for (let i = 0; i < nums.length; i++) {
                    try {
                        await sendWhatsAppNewRideOrderMessage(nums[i], "Admin", rideOrder);
                    } catch (error) {
                        fastify.log.error(error);
                    }
                }

                if (rideOrder.sendVia === 'whatsapp') {
                    try {
                        await sendWhatsAppNewRideOrderMessage(rideOrder.phone, rideOrder.fullname, rideOrder);
                    } catch (error) {
                        fastify.log.error(error);
                    }
                } else if (rideOrder.sendVia === 'email' && rideOrder.email) {
                    try {
                        sendEmailOrderCreated(rideOrder);
                    } catch (error) {
                        fastify.log.error(error);
                    }
                }

                try {
                    await sendSMSNotificationConfirmOrderMessage(rideOrder.phone);
                } catch (error) {
                    fastify.log.error(error);
                }
            }


            if(rideOrder.primaryDriver){
                const driver = await DriverService.getDriverById(fastify, rideOrder.primaryDriver);
                if (driver) {
                    try {
                        await sendWhatsAppNewRideOrderMessage(driver.phone_number, driver.name, rideOrder);
                    } catch (error) {
                        fastify.log.error(error);
                    }
                }
            }
            if(rideOrder.secondaryDriver){
                const driver = await DriverService.getDriverById(fastify, rideOrder.secondaryDriver);
                if (driver) {
                    try {
                        await sendWhatsAppNewRideOrderMessage(driver.phone_number, driver.name, rideOrder);
                    } catch (error) {
                        fastify.log.error(error);
                    }
                }
            }
            if(rideOrder.auxDriver){
                const driver = await DriverService.getDriverById(fastify, rideOrder.auxDriver);
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