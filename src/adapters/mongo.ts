import {FastifyInstance} from "fastify";
import {configENV} from "../utils";
import * as mongoose from "mongoose";


const mongoDB = (fastify: FastifyInstance) => {
    const { MONGO_DB_URL, MONGO_DB_CLUSTER, MONGO_DB_NAME, MONGO_DB_USERNAME, MONGO_DB_PASSWORD } = configENV;

    mongoose
        .connect(
            `mongodb+srv://${MONGO_DB_USERNAME}:${encodeURIComponent(MONGO_DB_PASSWORD)}@${MONGO_DB_URL}/?retryWrites=true&w=majority&appName=${MONGO_DB_CLUSTER}`,
            {
                dbName: MONGO_DB_NAME,
            }
        )
        .then(() => fastify.log.info('MongoDB connected...'))
        .catch(err => fastify.log.error(err));

    console.log(
        `mongodb+srv://${MONGO_DB_USERNAME}:${encodeURIComponent(MONGO_DB_PASSWORD)}@${MONGO_DB_URL}/?retryWrites=true&w=majority&appName=${MONGO_DB_CLUSTER}`
    )

    fastify.log.info("[ok] Connected to MongoDB");
}

export default mongoDB;
