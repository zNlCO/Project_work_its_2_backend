import { NextFunction, Request, Response } from "express";
import { InsuranceModel } from "./insurance.model";

export const fetchAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const insurance = await InsuranceModel.find();
        res.status(200).json({'message':'Insurances fetched','data':insurance});
    }
    catch (err) {
        next(err);
    }
}

export const modifyInsurance = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.user?.isOperator)
        return res.status(401);
        try {
            const {prezzo} = req.body;
            const {id}=req.params;
            
             const insurance = await InsuranceModel.findByIdAndUpdate(
                    id,
                    {
                        prezzo
                    },
                    { new: true, runValidators: true }
                );
        
                if (!insurance) return res.status(404).json({ error: 'Accessorio non trovato' });
            
                    
            
            res.status(201).json({'message':'Store created','data':insurance});
    }

    catch (err) {
        next(err);
    }
}




export const insertInsurance = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.user?.isOperator)
        return res.status(401);
        try {
            const insurance = req.body;
    
            const existingInsurance = await InsuranceModel.findOne({ descrizione:insurance.descrizione });
            if (existingInsurance) {
                return res.status(409).json({ error: 'Insurance already exists' });
            }
    
            const newInsurance = await InsuranceModel.create(insurance);
            
            res.status(201).json({'message':'Insurance created','data':newInsurance});
    }

    catch (err) {
        next(err);
    }
}


