import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyCompress from '@fastify/compress'
import fastifyHelmet from '@fastify/helmet'
import fastifyJWT from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import mongoDB from "./adapters/mongo";
import * as process from "node:process";
import {configENV} from "./utils";
import {FST_JWT_AUTHORIZATION_TOKEN_EXPIRED, FST_JWT_NO_AUTHORIZATION_IN_HEADER, FST_JWT_AUTHORIZATION_TOKEN_INVALID} from "./consts/fastify_errors";
import {TOKEN_EXPIRED, UNAUTHENTICATED, UNAUTHORIZED} from "./consts/client_errors";
import userRoutes from './routes/users';
import riderOrderRoutes from './routes/ride_order';
import UserServices from "./services/users";


const logger = process.env.NODE_ENV === 'production' ? {
    transport: {
        target: "pino-loki",
        options: {
            batching: true,
            interval: 5,
            host: 'http://localhost:3100/',
        },
    }
} : {
    transport: { target: 'pino-pretty' },
};

const server = fastify(
    {
        disableRequestLogging: true,
        logger: logger,
    }
)

// Register CORS
server.register(fastifyCors, {
    origin: (origin, cb) => {
        const hostname = new URL(origin).hostname
        if(['192.168.1.135', 'localhost', 'www.hop-taxi.ch'].includes(hostname)){
            cb(null, true)
            return
        }

        cb(new Error("Not allowed"), false)
    }
});
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
        const x = await request.jwtVerify()
        const user = await UserServices.getById(server, x.id)
        if (user === null) {
            return reply.code(401).send({
                code: UNAUTHORIZED
            });
        }
        user.password = undefined;
        request.user = user;
    } catch (err) {
        switch (err.code) {
            case FST_JWT_NO_AUTHORIZATION_IN_HEADER:
            case FST_JWT_AUTHORIZATION_TOKEN_INVALID:
                return reply.code(401).send({
                    code: UNAUTHENTICATED
                })
            case FST_JWT_AUTHORIZATION_TOKEN_EXPIRED:
                return reply.code(401).send({
                    code: TOKEN_EXPIRED
                })
            default:
                return reply.send(err)
        }
    }
})

server.decorate("hasRole", function(roles: string[]) {
    return async function(request, reply: any) {
        const user = request.user;
        if (!roles.includes(user.role)) {
            return reply.code(401).send({
                code: UNAUTHORIZED
            });
        }
    }
})

server.addHook('onSend', function (_request, reply, payload, next) {
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
server.addHook('onSend', function (_request, reply, payload, next) {
    const logData = {
        request: { method: _request.method, url: _request.url, headers: _request.headers, body: _request.body },
        response: { statusCode: reply.statusCode, headers: reply.getHeaders(), body: payload },
        timestamp: +new Date()
    }
    _request.log.info(logData)
    next();
})



server.register(userRoutes, { prefix: '/api/v1/users' });
server.register(riderOrderRoutes, { prefix: '/api/v1/rides' });

server.listen({ host: configENV.HOST, port: parseInt(configENV.PORT, 10) }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
});
