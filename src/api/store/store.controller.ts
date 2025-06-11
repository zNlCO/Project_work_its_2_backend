import { NextFunction, Request, Response } from "express";
import { StoreModel } from "./store.model";

export const fetchAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stores = await StoreModel.find();
        res.json(stores);
    }
    catch (err) {
        next(err);
    }
}