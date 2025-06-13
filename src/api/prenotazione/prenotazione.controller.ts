import { PrenotazioneModel } from './prenotazione.model';
import { NextFunction, Request, Response } from "express";

export const fetchAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as { id: string; isOperator: boolean }; // tipizzazione opzionale

        const query = user.isOperator ? {} : { idUser: user.id };

        const prenotazioni = await PrenotazioneModel.find(query);

        res.status(200).json({ message: 'Prenotazioni fetched', data: prenotazioni });
    } catch (err) {
        next(err);
    }
};



export const insertBooking = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.user?.isOperator)
        return res.status(401);
    try {
        const booking = req.body;

        // const existingBigMike = await BikeModelModel.findOne({ descrizione: bikeModel.descrizione, size: bikeModel.size });
        // if (existingBigMike) {
        //     return res.status(409).json({ error: 'BikeModel già creato' });
        // }

        const newBooking = await PrenotazioneModel.create(booking);

        res.status(201).json({ 'message': 'Booking created', 'data': newBooking });
    }

    catch (err) {
        next(err);
    }
}

// export const modifyBikeModel = async (req: Request, res: Response, next: NextFunction) => {

//     if (!req.user?.isOperator)
//         return res.status(401);
//     try {
//         const { prezzo, type, size, elettrica, imgUrl, descrizione } = req.body;
//         const { id } = req.params;

//         const bikemodel = await BikeModelModel.findByIdAndUpdate(
//             id,
//             {
//                 prezzo,
//                 type,
//                 size,
//                 elettrica,
//                 imgUrl,
//                 descrizione
//             },
//             { new: true, runValidators: true }
//         );

//         if (!bikemodel) return res.status(404).json({ error: 'Accessorio non trovato' });



//         res.status(201).json({ 'message': 'Bike model modified', 'data': bikemodel });
//     }

//     catch (err) {
//         next(err);
//     }
// }