import './jwt/jwt-strategy';
import './local/local-strategy';
import { User as myUser } from '../../user/user.entity';

declare global {
    namespace Express {
        interface User extends myUser {

        }
    }
}