import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import DriverService from '../services/drivers';
import {IDriver, IDriverLogin} from '../models/driver.model';
import {INVALID_CREDENTIAL} from "../consts/client_errors";

async function driverRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/login',
        async (request: FastifyRequest<{ Body: IDriverLogin }>, reply: FastifyReply) => {
        const driverPayload: IDriverLogin = request.body as any;
        const driverResult = await DriverService.getByUsername(fastify, driverPayload.username);
        if (driverResult === null) {
            return reply.code(401).send({
                code: INVALID_CREDENTIAL
            });
        }

        if (await DriverService.comparePassword(fastify, driverPayload.password, driverResult.password)) {
            const access_token = fastify.jwt.sign({
                id: driverResult._id.toHexString(),
                userType: "driver"
            }, {
                expiresIn: '30d'
            });
            return reply.send({access_token});
        }

        return reply.code(401).send({
            code: INVALID_CREDENTIAL
        });
    });
    fastify.delete('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
        reply.clearCookie('sr_access_token')

        return reply.send({ message: 'Logout successful' })
    });

    fastify.post(
        '/create',
        {preHandler: [fastify.authenticate, fastify.hasRole(['super_admin'])]},
        async (request: FastifyRequest<{ Body: IDriver }>, reply: FastifyReply) => {
            try {
                const driver = await DriverService.createDriver(fastify, request.body);
                return reply.send(driver);
            } catch (error) {
                return reply.status(500).send(error);
            }
        });

    fastify.get(
        '/me',
        {preHandler: [fastify.authenticate, fastify.hasRole(['driver'])]},
        async (request: FastifyRequest, reply: FastifyReply) => {
            return reply.send(request.user);
        });

    fastify.get(
        '/:id',
        {preHandler: [fastify.authenticate, fastify.hasRole(['super_admin', 'operator'])]},
        async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
            try {
                const driver = await DriverService.getDriverById(fastify, request.params.id);
                if (!driver) {
                    return reply.status(404).send({message: 'Driver not found'});
                } else {
                    return reply.send(driver);
                }
            } catch (error) {
                return reply.status(500).send(error);
            }
        });

    fastify.get(
        '/',
        {preHandler: [fastify.authenticate, fastify.hasRole(['super_admin', 'operator'])]},
        async (_request: FastifyRequest, reply: FastifyReply) => {
            try {
                const drivers = await DriverService.getAllDrivers(fastify);
                return reply.send(drivers);
            } catch (error) {
                return reply.status(500).send(error);
            }
        }
    );
    fastify.get(
        '/my-rides',
        {preHandler: [fastify.authenticate, fastify.hasRole(['driver'])]},
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const user: any = request.user;
                const rides = await DriverService.myRides(fastify, user._id);
                return reply.send(rides);
            } catch (error) {
                return reply.status(500).send(error);
            }
        });
    fastify.put(
        '/set-end-price/:id',
        {preHandler: [fastify.authenticate, fastify.hasRole(['driver'])]},
        async (request: FastifyRequest<{ Params: { id: string }, Body: { endPrice: string } }>, reply: FastifyReply) => {
            try {
                const user: any = request.user;
                const updatedRide: any = await DriverService.setEndPrice(fastify, user._id, request.params.id, request.body.endPrice);
                if (!updatedRide) {
                    return reply.status(404).send({message: 'Ride not found'});
                } else {
                    return reply.send(updatedRide);
                }
            } catch (error) {
                return reply.status(500).send(error);
            }
        });
    fastify.put(
        '/:id',
        {preHandler: [fastify.authenticate, fastify.hasRole(['super_admin'])]},
        async (request: FastifyRequest<{
            Params: { id: string },
            Body: IDriver
        }>, reply: FastifyReply) => {
            try {
                const updatedDriver = await DriverService.updateDriver(fastify, request.params.id, request.body);
                if (!updatedDriver) {
                    return reply.status(404).send({message: 'Driver not found'});
                } else {
                    return reply.send(updatedDriver);
                }
            } catch (error) {
                return reply.status(500).send(error);
            }
        });

    fastify.delete(
        '/:id',
        {preHandler: [fastify.authenticate, fastify.hasRole(['super_admin'])]},
        async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
            try {
                const deletedDriver = await DriverService.deleteDriver(fastify, request.params.id);
                if (!deletedDriver) {
                    return reply.status(404).send({message: 'Driver not found'});
                } else {
                    return reply.send({message: 'Driver deleted successfully'});
                }
            } catch (error) {
                return reply.status(500).send(error);
            }
        });
}

export default driverRoutes;