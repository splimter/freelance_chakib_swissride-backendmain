import {FastifyInstance} from 'fastify';
import UserRepository from "../../repositories/users";
import {IUser} from "../../models/user.model";
import bcrypt from "bcrypt";

const saltRounds = 10;

const UserServices = {
    create: async (fastify: FastifyInstance, user: IUser) => {
        try {
            return await UserRepository.create(user);
        } catch (error) {
            fastify.log.error(error);
            return null;
        }
    },
    getByUsername: async (fastify: FastifyInstance, username: string) => {
        try {
            return await UserRepository.getBy("username", username);
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
    }
}

export default UserServices;