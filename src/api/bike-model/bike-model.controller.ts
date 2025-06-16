import { NextFunction, Request, Response } from "express";
import { BikeModelModel } from "./bike-model.model";

export const fetchAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filter: { size?: string; type?: string } = {};

        if (req.body) {
            if (req.body.size) {
                filter.size = req.body.size;
            }
            if (req.body.type) {
                filter.type = req.body.type;
            }
        }

        const bikeModels = await BikeModelModel.find(filter);

        res.status(200).json({ message: 'Bike model extracted', data: bikeModels });
    } catch (err) {
        next(err);
    }
};


export const insertBikeModel = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.user?.isOperator)
        return res.status(401);
    try {
        const bikeModel = req.body;

        const existingBigMike = await BikeModelModel.findOne({ descrizione: bikeModel.descrizione, size: bikeModel.size });
        if (existingBigMike) {
            return res.status(409).json({ error: 'BikeModel già creato' });
        }

        const newBikeModel = await BikeModelModel.create(bikeModel);

        res.status(201).json({ 'message': 'Bike model created', 'data': newBikeModel });
    }

    catch (err) {
        next(err);
    }
}

export const modifyBikeModel = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.user?.isOperator)
        return res.status(401);
    try {
        const { prezzo, type, size, elettrica, imgUrl, descrizione } = req.body;
        const { id } = req.params;

        const bikemodel = await BikeModelModel.findByIdAndUpdate(
            id,
            {
                prezzo,
                type,
                size,
                elettrica,
                imgUrl,
                descrizione
            },
            { new: true, runValidators: true }
        );

        if (!bikemodel) return res.status(404).json({ error: 'Accessorio non trovato' });



        res.status(201).json({ 'message': 'Bike model modified', 'data': bikemodel });
    }

    catch (err) {
        next(err);
    }
}

export const deleteBikeModel = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.user?.isOperator)
        return res.status(401);
    try {
        const { id } = req.params;

        const bikeModel = await BikeModelModel.findByIdAndDelete(id);

        if (!bikeModel) return res.status(404).json({ error: 'Modello non trovato' });

        res.status(201).json({ 'message': 'Bike model deleted', 'data': bikeModel });
    }

    catch (err) {
        next(err);
    }
}