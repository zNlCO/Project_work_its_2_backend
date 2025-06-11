import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../utils/typed-request";
import { AddUserDTO, LoginDTO } from "./user.dto";
import { UserModel } from "./user.model";
import passport from "passport";
import * as jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const FRONTEND_URL = process.env.FRONTEND_ACTIVATE_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'mia-chiave-di-default';
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const me = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    res.json(user);
}

export const login = async (req: TypedRequest, res: Response, next: NextFunction) => {

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

            if (!user.isVerified) {
                return res.status(403).json({ error: 'Verifica l\'email prima di accedere.' });
            }

            const token = jwt.sign(user, JWT_SECRET);

            res.status(200);
            res.json({
                user,
                token
            });
        });

        authMiddleware(req, res, next);
    } catch (e) {
        next(e);
    }
}

export const register = async (req: TypedRequest<AddUserDTO>, res: Response, next: NextFunction) => {
    try {
        const user = req.body;

        const existingUser = await UserModel.findOne({ email: user.email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email già registrata' });
        }


        const newUser = await UserModel.create(user);

        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1d' });
        const verificationLink = `${FRONTEND_URL}?token=${token}`;

        await transporter.sendMail({
            from: `"Bike Rental" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Conferma la tua registrazione',
            html: `
           <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f7; padding: 40px 0;">
            <tr>
                <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; padding: 30px; font-family: Arial, sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                    <td style="font-size: 18px; color: #333333;">
                        <p style="margin-top: 0;">Ciao ${user.name},</p>
                        <p style="margin-bottom: 30px;">Grazie per esserti registrato! Per completare la registrazione, clicca sul bottone qui sotto:</p>

                        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 30px auto;">
                        <tr>
                            <td align="center" bgcolor="#4CAF50" style="border-radius: 6px;">
                            <a href="${verificationLink}" target="_blank" style="
                                display: inline-block;
                                padding: 14px 28px;
                                font-size: 16px;
                                font-weight: bold;
                                color: #ffffff;
                                background-color: #4CAF50;
                                text-decoration: none;
                                border-radius: 6px;
                                font-family: Arial, sans-serif;
                            ">Attiva il tuo account</a>
                            </td>
                        </tr>
                        </table>

                        <p style="font-size: 14px; color: #777777;">
                        Questo link è valido per 24 ore. Se non hai richiesto la registrazione, puoi ignorare questa email.
                        </p>

                        <p style="font-size: 14px; color: #777777; margin-top: 30px;">Grazie,<br><strong>Il team</strong></p>
                    </td>
                    </tr>
                </table>
                </td>
            </tr>
            </table>


      `,
        });

        res.status(201).json({ message: 'Utente registrato. Controlla la tua email per attivare il tuo account.' });
    } catch (e) {
        console.error('Errore register:', e);
        res.status(400).json({ error: 'Errore durante la registrazione' });
    }
}