import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import DriverService from '../services/drivers';
import {IDriver, IDriverLogin} from '../models/driver.model';
import {INVALID_CREDENTIAL} from "../consts/client_errors";

async function driverRoutes(server: FastifyInstance) {
    server.post('/login', async (request: FastifyRequest<{ Body: IDriverLogin }>, reply: FastifyReply) => {
        const driverPayload: IDriverLogin = request.body as any;
        const driverResult = await DriverService.getByUsername(driverPayload.username);
        if (driverResult === null) {
            return reply.code(401).send({
                code: INVALID_CREDENTIAL
            });
        }

        if (await DriverService.comparePassword(driverPayload.password, driverResult.password)) {
            const access_token = server.jwt.sign({
                id: driverResult._id.toHexString()
            }, {
                expiresIn: '30d'
            });
            return reply.send({access_token});
        }

        return reply.code(401).send({
            code: INVALID_CREDENTIAL
        });
    });

    server.post(
        '/create',
        {preHandler: [server.authenticate, server.hasRole(['super_admin'])]},
        async (request: FastifyRequest<{ Body: IDriver }>, reply: FastifyReply) => {
            try {
                const driver = await DriverService.createDriver(request.body);
                return reply.send(driver);
            } catch (error) {
                return reply.status(500).send(error);
            }
        });

    server.get(
        '/me',
        {preHandler: [server.authenticate, server.hasRole(['driver'])]},
        async (request: FastifyRequest, reply: FastifyReply) => {
            return reply.send(request.user);
        });

    server.get(
        '/:id',
        {preHandler: [server.authenticate, server.hasRole(['super_admin', 'operator'])]},
        async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
            try {
                const driver = await DriverService.getDriverById(request.params.id);
                if (!driver) {
                    return reply.status(404).send({message: 'Driver not found'});
                } else {
                    return reply.send(driver);
                }
            } catch (error) {
                return reply.status(500).send(error);
            }
        });

    server.get(
        '/',
        {preHandler: [server.authenticate, server.hasRole(['super_admin', 'operator'])]},
        async (_request: FastifyRequest, reply: FastifyReply) => {
            try {
                const drivers = await DriverService.getAllDrivers();
                return reply.send(drivers);
            } catch (error) {
                return reply.status(500).send(error);
            }
        });

    server.put(
        '/:id',
        {preHandler: [server.authenticate, server.hasRole(['super_admin'])]},
        async (request: FastifyRequest<{
            Params: { id: string },
            Body: IDriver
        }>, reply: FastifyReply) => {
            try {
                const updatedDriver = await DriverService.updateDriver(request.params.id, request.body);
                if (!updatedDriver) {
                    return reply.status(404).send({message: 'Driver not found'});
                } else {
                    return reply.send(updatedDriver);
                }
            } catch (error) {
                return reply.status(500).send(error);
            }
        });

    server.delete(
        '/:id',
        {preHandler: [server.authenticate, server.hasRole(['super_admin'])]},
        async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
            try {
                const deletedDriver = await DriverService.deleteDriver(request.params.id);
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