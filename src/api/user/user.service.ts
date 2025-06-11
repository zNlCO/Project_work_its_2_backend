import { User } from "./user.entity";
import { UserModel } from "./user.model";

export class UserService {

    async register(user: User): Promise<User> {

        const newUser = await UserModel.create(user);
        await UserModel.create({
            email: user.email,
            password: user.password,
            name: user.name,
            isOperator: user.isOperator,
            isVerified: user.isVerified
        });

        return newUser;
    }

}

export default new UserService();