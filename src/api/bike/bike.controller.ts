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

        res.json(biciDisponibili);

    } catch (err) {
        console.error('Errore nel recupero delle bici disponibili:', err);
        res.status(500).json({ error: 'Errore server' });
    }
}