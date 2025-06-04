import { ContoCorrente, ContoCorrente as ContoCorrenteModel } from "./contiCorrenti.model";
import { UserIdentity as UserIdentityModel } from "../../utils/auth/local/user-identity.model";
import { ContiCorrenti } from "./contiCorrenti.entity";
import { UserExistsError } from "../../errors/user-exists";
import * as bcrypt from 'bcrypt';
import { OtpModel } from "../Otp/otp.model";
import { NotFoundError } from "../../errors/not-found";
import { UserIdentity } from "../../utils/auth/local/user-identity.entity";
const { faker } = require('@faker-js/faker');


export class ContiCorrentiService {

  async add(contoCorrente: ContiCorrenti, credentials: {email: string, password: string}): Promise<ContiCorrenti> {
    const existingIdentity = await UserIdentityModel.findOne({'credentials.email': credentials.email});
    if (existingIdentity) {
      throw new UserExistsError();
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    console.log({...contoCorrente, IBAN: this.updIBAN()});
    const newConto = await ContoCorrenteModel.create({...contoCorrente, IBAN: this.updIBAN()});

    await UserIdentityModel.create({
      provider: 'local',
      contoCorrente: newConto._id,
      credentials: {
        email: credentials.email,
        hashedPassword
      }
    })

    return newConto;
  }

  async findUserByConto(contoId: string | undefined): Promise<UserIdentity[]> {
    return await UserIdentityModel.find({contoCorrente: contoId});
  }

  async updatePassword(contoId: string | undefined, newHashedPassword: string) {
    return await UserIdentityModel.updateOne({contoCorrente: contoId}, {
      "credentials.hashedPassword": newHashedPassword,
    });
  }

  async takeEmail(contoId: string | undefined): Promise<string> {
    const user = await UserIdentityModel.findOne({contoCorrente: contoId});
    if (!user) {
      throw new NotFoundError();
    }

    return user.credentials.email;
  }
  updIBAN(): string {
    
    const checkDigits = faker.number.int({ min: 10, max: 99 }).toString(); // Due cifre di controllo
    const bankCode = faker.string.numeric(5); // Codice banca (5 cifre)
    const branchCode = faker.string.numeric(5); // Codice filiale (5 cifre)
    const accountNumber = faker.string.numeric(12); // Numero di conto (12 cifre)
  
    // Componiamo l'IBAN
    const iban = `IT${checkDigits}${bankCode}${branchCode}${accountNumber}`;
  
    return iban;
    
  }

}

export default new ContiCorrentiService();
