import './local/local-strategy';
import './jwt/jwt-strategy';
import { UserEntity as iUser } from '../../api/users/user.entity';


declare global {
  namespace Express {
    interface User extends iUser {
    }
  }
}