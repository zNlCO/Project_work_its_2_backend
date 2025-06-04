import './local/local-strategy';
import './jwt/jwt-strategy';
import { ContiCorrenti as iContiCorrenti } from '../../api/ContiCorrenti/contiCorrenti.entity';


declare global {
  namespace Express {
    interface User extends iContiCorrenti {
    }
  }
}