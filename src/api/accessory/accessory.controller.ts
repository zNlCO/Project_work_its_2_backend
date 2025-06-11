import { NextFunction, Request, Response } from "express";
import { AccessoryModel } from "./accessory.model";

export const fetchAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessories = await AccessoryModel.find();
        res.status(200).json({'message':'Accessories fetched','data':accessories});
    }
    catch (err) {
        next(err);
    }
}

export const modifyAccessory = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.user?.isOperator)
        return res.status(401);
        try {
            const {prezzo} = req.body;
            const {id}=req.params;
            
             const accessory = await AccessoryModel.findByIdAndUpdate(
                    id,
                    {
                        prezzo
                    },
                    { new: true, runValidators: true }
                );
        
                if (!accessory) return res.status(404).json({ error: 'Accessorio non trovato' });
            
                    
            
            res.status(201).json({'message':'Store created','data':accessory});
    }

    catch (err) {
        next(err);
    }
}




export const insertAccessory = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.user?.isOperator)
        return res.status(401);
        try {
            const accessory = req.body;
    
            const existingAccessory = await AccessoryModel.findOne({ descrizione:accessory.descrizione });
            if (existingAccessory) {
                return res.status(409).json({ error: 'Accessorio già creato' });
            }
    
            const newAccessory = await AccessoryModel.create(accessory);
            
            res.status(201).json({'message':'Accessory created','data':newAccessory});
    }

    catch (err) {
        next(err);
    }
}


