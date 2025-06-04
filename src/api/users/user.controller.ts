import { NextFunction, Request, Response } from "express";
import { UserEntity } from "./user.entity";
import { TypedRequest } from "../../utils/typed-request.interface";
import UsersService from "./user.service";


export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = await UsersService.takeEmail(req.user!.id);
    res.json({...req.user!, email});
  } catch (err) {
    next(err);
  }
};
