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


export const modifyStore = async (req: Request, res: Response, next: NextFunction) => {
     const { id } = req.params;
    const { location} = req.body;
        try {
       
        // Solo operatori possono accedere a questa rotta
        if (!req.user?.isOperator) {
            return res.status(403).json({ error: 'Accesso negato: non sei un operatore' });
        }
        const store = await StoreModel.findByIdAndUpdate(
            id,
            {
                location
            },
            { new: true, runValidators: true }
        );

        if (!store) return res.status(404).json({ error: 'Modello non trovato' });

       res.status(200).json({'message':'Store updated','data':store});

    } catch (err) {
        console.error('Errore recupero utenti:', err);
        res.status(500).json({ error: 'Errore interno del server' });
    }
}


export const deleteStore = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.isOperator) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const idAcc = req.params.id; // prendi solo l'id

        const store = await StoreModel.findByIdAndDelete(idAcc);

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        res.status(200).json({ message: 'Store deleted', data: store });
    } catch (err) {
        next(err);
    }
};