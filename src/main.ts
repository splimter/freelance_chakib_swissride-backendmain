import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyCompress from '@fastify/compress'
import fastifyHelmet from '@fastify/helmet'
import fastifyJWT from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import rotatingFileStream from 'pino-rotating-file-stream';
import mongoDB from "./adapters/mongo";
import * as process from "node:process";
import {configENV} from "./utils";
import {FST_JWT_AUTHORIZATION_TOKEN_EXPIRED, FST_JWT_NO_AUTHORIZATION_IN_HEADER, FST_JWT_AUTHORIZATION_TOKEN_INVALID} from "./consts/fastify_errors";
import {TOKEN_EXPIRED, UNAUTHORIZED} from "./consts/client_errors";


const logger = process.env.NODE_ENV === 'production' ? {
    stream: rotatingFileStream({
        filename: 'logs.log',
        path: './logs',
    })
} : {
    transport: {target: 'pino-pretty'},
}
const server = fastify(
    {
        disableRequestLogging: true,
        logger: logger,
    }
)

// Register CORS
server.register(fastifyCors, {origin: '*'});
// Register Compression
server.register(fastifyCompress);
// Register Helmet
server.register(fastifyHelmet);
// Register MongoDB
server.register(mongoDB);
// Register JWT
server.register(fastifyJWT, {
    secret: configENV.JWT_SECRET,
});
// Register cookies
server.register(fastifyCookie, {
    secret: configENV.JWT_SECRET,
    hook: 'preHandler',
})

server.decorate("authenticate", async function(request, reply) {
    try {
        await request.jwtVerify()
    } catch (err) {
        switch (err.code) {
            case FST_JWT_NO_AUTHORIZATION_IN_HEADER:
            case FST_JWT_AUTHORIZATION_TOKEN_INVALID:
                reply.code(401).send({
                    code: UNAUTHORIZED
                })
                break;
            case FST_JWT_AUTHORIZATION_TOKEN_EXPIRED:
                reply.code(401).send({
                    code: TOKEN_EXPIRED
                })
                break;
            default:
                reply.send(err)
        }
        reply.send(err)
    }
})

server.addHook('onSend', function (_request, reply, payload, next) {
    console.log({payload})
    const logData = {
        request: { method: _request.method, url: _request.url, headers: _request.headers, body: _request.body },
        response: { statusCode: reply.statusCode, headers: reply.getHeaders(), body: payload },
        timestamp: +new Date()
    }
    _request.log.info(logData)
    next();
})
server.addHook('preHandler', (req, res, next) => {
    req.jwt = server.jwt
    return next()
})

import userRoutes from './routes/users';
import riderOrderRoutes from './routes/ride_order';


server.register(userRoutes, { prefix: '/api/v1/users' });
server.register(riderOrderRoutes, { prefix: '/api/v1/rides' });

server.listen({ host: "192.168.1.135", port: 8080 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
});
