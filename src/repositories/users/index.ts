import User, {IUser} from "../../models/user.model";


const UserRepository = {
    getBy: async (field: string, value: string, withPassword=false) => {
        const req: any = User.findOne({[field as any]: value});
        if (withPassword === false){
            req.select('-password');
        }
        return await req;
    },
    getAllBy: async (field: string, value: string) => {
        return User.find({[field as any]: value}).select('-password');
    },
    create: async (entity: IUser) => {
        const user = new User(entity);
        return await user.save();
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
        return User.findByIdAndDelete(id);
    }
}

export default UserRepository;