import { NextFunction, Response } from "express";
import { TypedRequest } from "../../utils/typed-request.interface";
import { AddUserDTO, changeDTO, LoginDTO } from "./auth.dto";
import { omit, pick } from 'lodash';
import { UserExistsError } from "../../errors/user-exists";
import contiCorrentiService from "../ContiCorrenti/contiCorrenti.service";
import passport from "passport";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UserIdentity } from "../../utils/auth/local/user-identity.entity";
import categorieMovimentiService from "../CategorieMovimenti/categorieMovimenti.service";
import MovimentiContiCorrentiService from "../MovimentiContiCorrenti/movimentiContiCorrenti.service";

const JWT_SECRET = 'my_jwt_secret';

export const login = async (
  req: TypedRequest<LoginDTO>,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401);
      res.json({
        error: 'LoginError',
        message: info.message
      });
      return;
    }
    const token = jwt.sign(user, JWT_SECRET, {expiresIn: '7 days'});
    res.status(200);
    res.json({
      user,
      token
    });
  })(req, res, next);
}


export const add = async (
  req: TypedRequest<AddUserDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = omit(req.body, 'email', 'password');
    const credentials = pick(req.body, 'email', 'password');
    const newUser = await contiCorrentiService.add(userData, credentials);
    res.send(newUser);

    const categoriaMovimento = await categorieMovimentiService.getByName("Apertura conto");
    const movimenti = await MovimentiContiCorrentiService.addFirstMoviemento(
      newUser.id!,
      categoriaMovimento?._id
    );
    
  } catch (err) {
    if (err instanceof UserExistsError) {
      res.status(400);
      res.send(err.message);
    } else {
      next(err);
    }
  }
}

// Nuovo: Cambiare password
export const changePassword = async (
  req: TypedRequest<changeDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const contoId = req.user!.id;

    // Validazione della nuova password
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }

    // Trova l'utente e verifica la password corrente
    const user: UserIdentity[] = await contiCorrentiService.findUserByConto(contoId); // Usiamo il contiCorrentiService per trovare l'utente
    if (!user) {
      return res.status(404).json({ message: 'User non collegato al conto' });
    }
     
    if (await bcrypt.compare(currentPassword, user[0].credentials.hashedPassword)) {
      
    }
    else {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    // Cripta la nuova password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Aggiorna la password
    await contiCorrentiService.updatePassword(contoId, hashedNewPassword);

    return res.status(200).json({ message: 'Password updated successfully.' });

  } catch (err) {
    next(err);
  }
};