import { UserEntity } from "../../../api/users/user.entity";

export interface UserIdentity {
    id: string;
    provider: string;
    credentials: {
        email: string;
        hashedPassword: string;
    };
    user: UserEntity;
}
