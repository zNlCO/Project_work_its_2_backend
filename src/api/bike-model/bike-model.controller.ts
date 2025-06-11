import { NextFunction, Request, Response } from "express";
import { BikeModelModel } from "./bike-model.model";

export const fetchAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bikeModels = await BikeModelModel.find();
        res.json(bikeModels);
    }
    catch (err) {
        next(err);
    }
}