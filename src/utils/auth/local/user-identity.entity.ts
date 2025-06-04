import { ContiCorrenti } from "../../../api/ContiCorrenti/contiCorrenti.entity";

export interface UserIdentity {
    id: string;
    provider: string;
    credentials: {
        email: string;
        hashedPassword: string;
    };
    contoCorrente: ContiCorrenti;
}
