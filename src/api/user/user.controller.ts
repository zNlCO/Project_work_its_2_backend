import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../utils/typed-request";
import { AddUserDTO, LoginDTO } from "./user.dto";
import { UserModel } from "./user.model";
import passport from "passport";
import * as jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import userService from "./user.service";

export const me = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    res.json(user);
}

export const login = async (req: TypedRequest<LoginDTO>, res: Response, next: NextFunction) => {

    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ error: 'Credenziali non valide' });

    if (!user.isVerified) {
        return res.status(403).json({ error: 'Verifica l\'email prima di accedere.' });
    }

    const token = jwt.sign(user, JWT_SECRET);
    res.json({ user, token });
}

export const register = async (req: TypedRequest<AddUserDTO>, res: Response, next: NextFunction) => {
    try {
        const user = req.body;

        // TODO CONTROLLA SE EMAIL ESISTE GIà
        
        const newUser = await userService.register(user);

        res.json(newUser);
    } catch (e) {
        // TODO
    }
}