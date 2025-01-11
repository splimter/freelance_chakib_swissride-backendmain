import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import UserServices from "../services/users";
import {IUserLogin, IUser} from "../models/user.model";
import {INVALID_CREDENTIAL} from "../consts/client_errors";
// import {sendWhatsAppMessage} from "../adapters/twilio_app_service";


export default async function userRoutes (fastify: FastifyInstance) {
    fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
        const userPayload: IUserLogin = request.body as any
        const userResult = await UserServices.getByUsername(fastify, userPayload.username, true)
        if (userResult === null) {
            return reply.code(401).send({
                code: INVALID_CREDENTIAL
            })
        }
        if(await UserServices.comparePassword(userPayload.password, userResult.password)) {
            const access_token = fastify.jwt.sign({
                id: userResult._id.toHexString(),
                userType: "admin"
            }, {
                expiresIn: '30d'
            })
            return reply.send({ access_token })
        }

        return reply.code(401).send({
            code: INVALID_CREDENTIAL
        })
    });
    fastify.delete('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
        reply.clearCookie('sr_access_token')

        return reply.send({ message: 'Logout successful' })
    });
    fastify.post('/register',{
        preHandler: [fastify.authenticate, fastify.hasRole(['super_admin'])]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const user: IUser = request.body as any;
        const response = await UserServices.create(fastify, user);
        if (response.isError) {
            return reply.code(400).send(response);
        } else {
            return reply.code(201).send({ id: response._id });
        }
    });
    fastify.put(
        '/:id',
        { preHandler: [fastify.authenticate] },
        async (request: FastifyRequest<{ Params: { id: string }, Body: IUser }>, reply: FastifyReply) => {
            try {
                const userId = request.params.id;
                const user = request.body;
                const result = await UserServices.update(fastify, userId, user);

                if (result.isError) {
                    return reply.status(400).send(result);
                } else {
                    return reply.send({ message: 'User updated successfully' });
                }
            } catch (error) {
                return reply.status(500).send(error);
            }
        }
    );
    fastify.get('/me', {
        preHandler: [fastify.authenticate, fastify.hasRole(['super_admin', 'operator'])]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        const user = request.user as IUser;
        return reply.send(user);
    });

    fastify.delete(
        '/:id',
        { preHandler: [fastify.authenticate, fastify.hasRole(['super_admin'])] },
        async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
            try {
                const userId = request.params.id;
                const result = await UserServices.delete(fastify, userId);
                if (result) {
                    return reply.send({ message: 'User deleted successfully' });
                } else {
                    return reply.status(404).send({ message: 'Failed to delete a user!' });
                }
            } catch (error) {
                return reply.status(500).send(error);
            }
        }
    );

    fastify.post(
        '/create-operator',
        { preHandler: [fastify.authenticate, fastify.hasRole(['super_admin'])] },
        async (request: FastifyRequest<{ Body: IUser }>, reply: FastifyReply) => {
            try {
                const result = await UserServices.createOperator(fastify, request.body);
                if (result.isError) {
                    return reply.status(400).send(result);
                } else {
                    return reply.send({ message: 'User updated successfully' });
                }
            } catch (error) {
                return reply.status(500).send(error);
            }
        }
    );

    fastify.get(
        '/operators',
        { preHandler: [fastify.authenticate, fastify.hasRole(['super_admin', 'operator'])] },
        async (_request: FastifyRequest, reply: FastifyReply) => {
            try {
                const operators = await UserServices.getAllOperators(fastify);
                return reply.send(operators);
            } catch (error) {
                return reply.status(500).send(error);
            }
        }
    );
}