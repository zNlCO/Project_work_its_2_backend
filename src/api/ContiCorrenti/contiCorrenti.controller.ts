import { NextFunction, Request, Response } from "express";
import { ContiCorrenti } from "./contiCorrenti.entity";
import { TypedRequest } from "../../utils/typed-request.interface";
import contiCorrentiService from "./contiCorrenti.service";
import { updateIBAN } from "./contiCorrenti.dto";


export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = await contiCorrentiService.takeEmail(req.user!.id);
    res.json({...req.user!, email});
  } catch (err) {
    next(err);
  }
};
