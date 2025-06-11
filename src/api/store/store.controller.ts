import { NextFunction, Request, Response } from "express";
import { StoreModel } from "./store.model";

export const fetchAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stores = await StoreModel.find();
        res.status(200).json({'message':'Stores fetched','data':stores});
    }
    catch (err) {
        next(err);
    }
}

export const insertStore = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.user?.isOperator)
        return res.status(401);
        try {
            const store = req.body;
    
            const existingStore = await StoreModel.findOne({ location:store.location });
            if (existingStore) {
                return res.status(409).json({ error: 'Email già registrata' });
            }
    
            const newStore = await StoreModel.create(store);
            
            res.status(201).json({'message':'Store created','data':newStore});
    }

    catch (err) {
        next(err);
    }
}