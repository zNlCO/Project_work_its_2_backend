import { PrenotazioneModel } from './prenotazione.model';
import { NextFunction, Request, Response } from "express";

export const fetchAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.isOperator) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const prenotazioni = await PrenotazioneModel.find()
            .populate({
                path: 'idUser',
                select: '-password -__v'
            })
            .populate({
                path: 'pickupLocation',
                select: '-__v'
            })
            .populate({
                path: 'dropLocation',
                select: '-__v'
            })
            .populate({
                path: 'bikes.id',
                select: '-__v',
                populate: [
                { path: 'idPuntoVendita', model: 'Store', select: '-__v' },
                { path: 'idModello', model: 'BikeModelModel', select: '-__v' }
                ]
            })
            .populate({
                path: 'bikes.accessori',
                model: 'Accessory',
                select: '-__v'
            })
            .populate({
                path: 'bikes.assicurazione',
                model: 'Insurance',
                select: '-__v'
            });


        res.status(200).json({ message: 'Prenotazioni all fetched', data: prenotazioni });
    } catch (err) {
        next(err);
    }
};

export const fetchMie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id=req.user?.id;

        const prenotazioni = await PrenotazioneModel.find({idUser:id})
        .populate({
                path: 'idUser',
                select: '-password -__v'
            })
            .populate({
                path: 'pickupLocation',
                select: '-__v'
            })
            .populate({
                path: 'dropLocation',
                select: '-__v'
            })
            .populate({
                path: 'bikes.id',
                select: '-__v',
                populate: [
                { path: 'idPuntoVendita', model: 'Store', select: '-__v' },
                { path: 'idModello', model: 'BikeModelModel', select: '-__v' }
                ]
            })
            .populate({
                path: 'bikes.accessori',
                model: 'Accessory',
                select: '-__v'
            })
            .populate({
                path: 'bikes.assicurazione',
                model: 'Insurance',
                select: '-__v'
            });

        res.status(200).json({ message: 'Prenotazioni mie fetched', data: prenotazioni });
    } catch (err) {
        next(err);
    }
};


export const fetchSingola = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let idPren = req.params;

        const prenotazioni = await PrenotazioneModel.findById(idPren);

        res.status(200).json({ message: 'Prenotazioni detail fetched', data: prenotazioni });
    } catch (err) {
        next(err);
    }
};


export const insertBooking = async (req: Request, res: Response, next: NextFunction) => {

    // if (!req.user?.isOperator)
    //     return res.status(401);
    try {
        const booking = req.body;

        const newBooking = await PrenotazioneModel.create(booking);

        res.status(201).json({ 'message': 'Booking created', 'data': newBooking });
    }

    catch (err) {
        next(err);
    }
}

export const insertLoggedBooking = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const booking = req.body;

        if(booking.userId==undefined){
            res.status(400).json({'message':'User non passato'})
        }

        const newBooking = await PrenotazioneModel.create(booking);

        res.status(201).json({ 'message': 'Booking created', 'data': newBooking });
    }

    catch (err) {
        next(err);
    }
}


// export const assignBooking = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const bookingID = req.body.id;

//         // const existingBigMike = await BikeModelModel.findOne({ descrizione: bikeModel.descrizione, size: bikeModel.size });
//         // if (existingBigMike) {
//         //     return res.status(409).json({ error: 'BikeModel già creato' });
//         // }

//         const newBooking = await PrenotazioneModel.findById(bookingID);

//         res.status(201).json({ 'message': 'Booking created', 'data': newBooking });
//     }

//     catch (err) {
//         next(err);
//     }
// }



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