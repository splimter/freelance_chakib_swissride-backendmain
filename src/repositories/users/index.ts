import User, {IUser} from "../../models/user.model";


const UserRepository = {
    getBy: async (field: string, value: string, withPassword=false) => {
        try {
            const req: any = User.findOne({[field as any]: value});
            if (withPassword === false){
                req.select('-password');
            }
            return await req;
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
    updateById: async (id: string, entity: IUser) => {
        try {
            return await User.findByIdAndUpdate(id, entity, {new: true});
        } catch (error) {
            return {
                error: true,
                codeName: error.codeName,
                keyValue: error.keyValue,
            };
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