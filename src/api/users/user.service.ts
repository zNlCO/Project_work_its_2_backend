import { UserModel } from "./user.model";
import { UserIdentity as UserIdentityModel } from "../../utils/auth/local/user-identity.model";
import { UserEntity } from "./user.entity";
import { UserExistsError } from "../../errors/user-exists";
import * as bcrypt from 'bcrypt';
import { OtpModel } from "../Otp/otp.model";
import { NotFoundError } from "../../errors/not-found";
import { UserIdentity } from "../../utils/auth/local/user-identity.entity";
const { faker } = require('@faker-js/faker');


export class UsersService {

  async add(userToUse: UserEntity, credentials: {email: string, password: string},typeToUse:string): Promise<UserEntity> {
    const existingIdentity = await UserIdentityModel.findOne({'credentials.email': credentials.email});
    if (existingIdentity) {
      throw new UserExistsError();
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const newUser = await UserModel.create({...userToUse});

    await UserIdentityModel.create({
      provider: 'local',
      userToUse: newUser._id,
      credentials: {
        email: credentials.email,
        hashedPassword
      },
      type:typeToUse
    })

    return newUser;
  }

  async findUserByConto(userID: string | undefined): Promise<UserIdentity[]> {
    return await UserIdentityModel.find({user: userID});
  }

  async updatePassword(userID: string | undefined, newHashedPassword: string) {
    return await UserIdentityModel.updateOne({user: userID}, {
      "credentials.hashedPassword": newHashedPassword,
    });
  }

  async takeEmail(userID: string | undefined): Promise<string> {
    const utente = await UserIdentityModel.findOne({user: userID});
    if (!utente) {
      throw new NotFoundError();
    }

    return utente.credentials.email;
  }
  

}

export default new UsersService();
