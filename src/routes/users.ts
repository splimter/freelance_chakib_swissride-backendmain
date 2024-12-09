import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import UserServices from "../services/users";
import {IUserLogin, IUser} from "../models/user.model";
import {INVALID_CREDENTIAL} from "../consts/client_errors";
// import {sendWhatsAppMessage} from "../adapters/twilio_app_service";


export default async function userRoutes (fastify: FastifyInstance) {
    fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
        const userPayload: IUserLogin = request.body as any
        const userResult = await UserServices.getByUsername(fastify, userPayload.username)
        if (userResult === null) {
            return reply.code(401).send({
                code: INVALID_CREDENTIAL
            })
        }

        if(await UserServices.comparePassword(userPayload.password, userResult.password)) {
            console.log({userResult: userResult._id.toHexString()})
            const access_token = fastify.jwt.sign({
                id: userResult._id.toHexString()
            }, {
                expiresIn: '30d'
            })
            return reply.send({ access_token })
        }

        return reply.code(401).send({
            code: INVALID_CREDENTIAL
        })
    });
    fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
        const user: IUser = request.body as any;
        const userId = await UserServices.create(fastify, user);
        if (userId) {
            return reply.code(201).send({ id: userId._id });
        } else {
            return reply.code(500).send({ error: 'Failed to add user' });
        }
    });
    fastify.get('/me', {
        preHandler: [fastify.authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        // await sendWhatsAppMessage()
        const user = request.user as IUser;
        return reply.send(user);
    });
    fastify.delete('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
        reply.clearCookie('sr_access_token')

        return reply.send({ message: 'Logout successful' })
    });
}