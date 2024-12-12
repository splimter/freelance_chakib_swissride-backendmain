import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import RideOrderService from "../services/ride_order";
import {IRideOrder, RideOrderState} from "../models/ride_order.model";
import { Types } from 'mongoose';
import {INVALID_RECORD, INVALID_REQ_PAYLOAD, NO_RECORD} from "../consts/client_errors";


const riderOrderRoutes = async (fastify: FastifyInstance) => {
    fastify.get('/', { preHandler: [fastify.authenticate, fastify.hasRole(['super_admin', 'operator'])] },
        async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const rideOrders = await RideOrderService.getAll(fastify);
            return reply.send(rideOrders);
        } catch (error) {
            return reply.code(500).send({ error: 'Failed to fetch ride orders' });
        }
    });
    fastify.get(
        '/:id',
        { preHandler: [fastify.authenticate, fastify.hasRole(['super_admin', 'operator'])] },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };

            if (!Types.ObjectId.isValid(id)) {
                return reply.code(400).send({
                    code: INVALID_REQ_PAYLOAD,
                    error: 'Invalid ride order ID'
                });
            }

            try {
                const rideOrder = await RideOrderService.getById(fastify, id);
                if (rideOrder) {
                    return reply.send(rideOrder);
                } else {
                    return reply.code(404).send({
                        code: NO_RECORD,
                        error: 'Ride order not found'
                    });
                }
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({
                    code: INVALID_RECORD,
                    error: 'Failed to fetch ride order'
                });
            }
        }
    );
    fastify.post(
        '/',
        {
            preHandler: [fastify.authenticate, fastify.hasRole(['super_admin', 'operator'])]
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const rideOrder: IRideOrder = request.body as any;
            const rideOrderId = await RideOrderService.create(fastify, rideOrder);
            if (rideOrderId) {
                return reply.code(201).send({ id: rideOrderId._id });
            } else {
                return reply.code(500).send({ error: 'Failed to add ride' });
            }
    }
    );
    fastify.put(
        '/:id',
        {
            preHandler: [fastify.authenticate, fastify.hasRole(['super_admin', 'operator'])]
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };
            const rideOrder: IRideOrder = request.body as any;

            if (!Types.ObjectId.isValid(id)) {
                return reply.code(400).send({
                    code: INVALID_REQ_PAYLOAD,
                    error: 'Invalid ride order ID'
                });
            }

            try {
                const updatedRideOrder = await RideOrderService.update(fastify, id, rideOrder);
                if (updatedRideOrder) {
                    return reply.code(200).send(updatedRideOrder);
                } else {
                    return reply.code(404).send({
                        code: NO_RECORD,
                        error: 'Ride order not found'
                    });
                }
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({
                    code: INVALID_RECORD,
                    error: 'Failed to update ride order'
                });
            }
        }
    );
    fastify.delete(
        '/:id',
        {
            preHandler: [fastify.authenticate, fastify.hasRole(['super_admin', 'operator'])]
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = request.params as { id: string };

            if (!Types.ObjectId.isValid(id)) {
                return reply.code(400).send({
                    code: INVALID_REQ_PAYLOAD,
                    error: 'Invalid ride order ID'
                });
            }

            try {
                const deletedRideOrder = await RideOrderService.delete(fastify, id);
                if (deletedRideOrder) {
                    return reply.code(200).send({});
                } else {
                    return reply.code(404).send({
                        code: NO_RECORD,
                        error: 'Ride order not found'
                    });
                }
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({
                    code: INVALID_RECORD,
                    error: 'Failed to delete ride order'
                });
            }
        }
    );
    fastify.post(
        '/state',
        {
            preHandler: [fastify.authenticate, fastify.hasRole(['super_admin', 'operator'])]
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id, state } = request.body as { id: string, state: RideOrderState };

            if (!Types.ObjectId.isValid(id)) {
                return reply.code(400).send({
                    code: INVALID_REQ_PAYLOAD,
                    error: 'Invalid ride order ID'
                });
            }

            if (!Object.values(RideOrderState).includes(state)) {
                return reply.code(400).send({
                    code: INVALID_REQ_PAYLOAD,
                    error: 'Invalid ride order state'
                });
            }

            try {
                const updatedRideOrder = await RideOrderService.updateState(fastify, id, state);
                if (updatedRideOrder) {
                    return reply.code(200).send({});
                } else {
                    return reply.code(404).send({
                        code: NO_RECORD,
                        error: 'Ride order not found'
                    });
                }
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({
                    code: INVALID_RECORD,
                    error: 'Failed to update ride order state'
                });
            }
        }
    );
};

export default riderOrderRoutes;