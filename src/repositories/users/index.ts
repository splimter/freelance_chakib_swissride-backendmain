import User, {IUser} from "../../models/user.model";


const UserRepository = {
    getBy: async (field: string, value: string) => {
        try {
            return await User.findOne({[field as any]: value}).select('-password');
        } catch (error) {
            console.log({error})
            return null;
        }
    },
    getAllBy: async (field: string, value: string) => {
        try {
            return await User.find({[field as any]: value}).select('-password');
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
    },
    deleteById: async (id: string) => {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            console.log({ error });
            return null;
        }
    }
}

export default UserRepository;