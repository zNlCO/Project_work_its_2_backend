import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../utils/typed-request";
import { AddUserDTO, LoginDTO } from "./user.dto";
import { UserModel } from "./user.model";
import passport from "passport";
import * as jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET || 'mia-chiave-di-default';

export const me = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    res.json(user);
}

export const login = async (req: TypedRequest<LoginDTO>, res: Response, next: NextFunction) => {

  try {
    const authMiddleware = passport.authenticate('local', (err, user, info) => {
      if (err) {
        next(err);
        return;
      }

      if (!user) {
        res.status(401);
        res.json({
          error: 'LoginError',
          message: info.message
        });
        return;
      }

      const token = jwt.sign(user, JWT_SECRET);

      res.status(200);
      res.json({
        user,
        token
      });
    });

    authMiddleware(req, res, next);
}

export const register = async (req: TypedRequest<AddUserDTO>, res: Response, next: NextFunction) => {
    try {
        const user = req.body;

        // TODO CONTROLLA SE EMAIL ESISTE GIà

        const newUser = await UserModel.create(user);

        return newUser;

        res.json(newUser);
    } catch (e) {
        // TODO
    }
}