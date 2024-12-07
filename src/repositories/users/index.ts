import User, {IUser} from "../../models/user.model";


const UserRepository = {
    getBy: async (field: string, value: string) => {
        try {
            return await User.findOne({[field as any]: value});
        } catch (error) {
            console.log({error})
            return null;
        }
    },
    create: async (entity: IUser) => {
        try {
            const user = new User(entity);
            return await user.save();
        } catch (error) {
            console.log({error})
            return null;
        }
    }
}

export default UserRepository;