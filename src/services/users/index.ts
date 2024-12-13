import {FastifyInstance} from 'fastify';
import UserRepository from "../../repositories/users";
import {IUser} from "../../models/user.model";
import bcrypt from "bcrypt";

const saltRounds = 10;

const UserServices = {
    create: async (fastify: FastifyInstance, user: IUser) => {
        try {
            user.password = await UserServices.generatePassword(user.password);
            return await UserRepository.create(user);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    getByUsername: async (fastify: FastifyInstance, username: string, withPassword=false) => {
        try {
            return await UserRepository.getBy("username", username, withPassword);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    getById: async (fastify: FastifyInstance, id: string) => {
        try {
            return await UserRepository.getBy("_id", id);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    update: async (fastify: FastifyInstance, id: string, user: IUser) => {
        try {
            if (user.password) {
                user.password = await UserServices.generatePassword(user.password);
            }
            return await UserRepository.updateById(id, user);
        } catch (error) {
            fastify.log.error(error);
            return error;
        }
    },
    delete: async (fastify: FastifyInstance, id: string) => {
        try {
            const result = await UserRepository.deleteById(id);
            return result;
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    generatePassword: async (password: string) => {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    },
    comparePassword: async (password: string, hash: string) => {
        return bcrypt.compare(password ,hash);
    },
    createOperator: async(fastify: FastifyInstance, body: IUser)=> {
        try {
            body.role = "operator";
            body.password = await UserServices.generatePassword(body.password);
            return await UserRepository.create(body);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    getAllOperators: async (fastify: FastifyInstance)=> {
        try {
            return await UserRepository.getAllBy("role", "operator");
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    }
}

export default UserServices;