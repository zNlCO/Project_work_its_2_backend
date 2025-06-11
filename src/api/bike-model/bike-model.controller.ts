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

export const insertBikeModel = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.user?.isOperator)
        return res.status(401);
        try {
            const bikeModel = req.body;
    
            const existingBigMike = await BikeModelModel.findOne({ descrizione:bikeModel.descrizione,size:bikeModel.size});
            if (existingBigMike) {
                return res.status(409).json({ error: 'BikeModel già creato' });
            }
    
            const newBikeModel = await BikeModelModel.create(bikeModel);
            
            res.status(201).json({'message':'Bike model created','data':newBikeModel});
    }

    catch (err) {
        next(err);
    }
}

export const modifyBikeModel = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.user?.isOperator)
        return res.status(401);
        try {
            const {prezzo,type,size,elettrica,imgUrl,descrizione} = req.body;
            const {id}=req.params;
            
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
            
                    
            
            res.status(201).json({'message':'Bike model modified','data':bikemodel});
    }

    catch (err) {
        next(err);
    }
}