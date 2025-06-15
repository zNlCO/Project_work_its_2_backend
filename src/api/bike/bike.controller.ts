import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../utils/typed-request";
import { FilterDateLocationDTO } from "./bike.dto";
import { PrenotazioneModel } from "../prenotazione/prenotazione.model";
import { BikeModel } from "./bike.model";

export const fetchDisponibili = async (req: TypedRequest<FilterDateLocationDTO>, res: Response, next: NextFunction) => {
    try {
        const { start, end, pickup_location } = req.body;

        const prenotazioniConflittuali = await PrenotazioneModel.find({
            cancelled: false,
            $or: [{ start: { $lt: end }, stop: { $gt: start } }]
        });

        const bikeIdsOccupate: string[] = []
        for (const p of prenotazioniConflittuali) {
            for (const b of p.bikes) {
                bikeIdsOccupate.push(String(b.id));
            }
        }

        const biciDisponibili = await BikeModel.find({
            _id: { $nin: Array.from(bikeIdsOccupate) },
            idPuntoVendita: pickup_location
        }).populate('idModello');

        res.status(201).json({ 'message': 'Bike model retrieved', 'data': biciDisponibili });

    } catch (err) {
        console.error('Errore nel recupero delle bici disponibili:', err);
        res.status(500).json({ error: 'Errore server' });
    }
}

export const fetchAllbyStore = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.user?.isOperator)
            return res.status(401);
        const { store } = req.params;

        const bikes = await BikeModel.find({ "idPuntoVendita": store }).populate('idModello');


        res.status(200).json({ 'message': 'Bike model retrieved', 'data': bikes });

    } catch (err) {
        console.error('Errore nel recupero delle bici disponibili:', err);
        res.status(500).json({ error: 'Errore server' });
    }
}

export const fetchAll = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.user?.isOperator)
            return res.status(401);

        let bikes = await BikeModel.find().populate('idModello');


        res.status(200).json({ 'message': 'Bike model retrieved', 'data': bikes });

    } catch (err) {
        console.error('Errore nel recupero delle bici disponibili:', err);
        res.status(500).json({ error: 'Errore server' });
    }
}



export const insertBike = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.user?.isOperator)
        return res.status(401);
    try {
        const bikeModel = req.body;

        const existingBike = await BikeModel.findOne({ idPuntoVendita: bikeModel.idPuntoVendita, idModello: bikeModel.idModello });
        console.log(existingBike)
        if (existingBike) {
            existingBike.quantity += 1;
            existingBike.save();
            res.status(201).json({ 'message': 'Bike model added', 'data': existingBike });
        }
        else {
            bikeModel.quantity = 1;
            const newBikeModel = await BikeModel.create(bikeModel);
            res.status(201).json({ 'message': 'Bike model created', 'data': newBikeModel });
        }




    }

    catch (err) {
        next(err);
    }
}


export const updateBike = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.isOperator)
        return res.status(403).json({ message: 'Accesso negato' });

    try {
        const bikeModelId = req.params.id;
        const { quantita } = req.body;

        if (quantita === undefined) {
            return res.status(400).json({ message: 'Campo "quantita" mancante nel body' });
        }

        const updatedBike = await BikeModel.findByIdAndUpdate(
            bikeModelId,
            { quantita }, // aggiorna solo il campo quantita
            { new: true } // restituisce il documento aggiornato
        );

        if (!updatedBike) {
            return res.status(404).json({ message: 'Bici non trovata' });
        }

        res.status(200).json({ message: 'Quantità aggiornata', data: updatedBike });
    } catch (err) {
        next(err);
    }
};