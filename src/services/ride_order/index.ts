import { FastifyInstance } from 'fastify';
import RideOrderRepository from "../../repositories/ride_order";
import { IRideOrder, RideOrderState } from "../../models/ride_order.model";

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
            return await RideOrderRepository.create(rideOrder);
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
            return await RideOrderRepository.update(id, rideOrder);
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