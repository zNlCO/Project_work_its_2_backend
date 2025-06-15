import { BikeModel } from '../bike/bike.model';
import { PrenotazioneModel } from './prenotazione.model';
import { NextFunction, Request, Response } from "express";
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
  tls: {
    rejectUnauthorized: false, // <-- aggiungi questo
  }
});

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
        let idPren = req.params.id;

        const prenotazioni = await PrenotazioneModel.findById(idPren).populate({
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
            });;

        res.status(200).json({ message: 'Prenotazioni detail fetched', data: prenotazioni });
    } catch (err) {
        next(err);
    }
};

export const analyticsHome = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.isOperator) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const prenotazioni = await PrenotazioneModel.find({
            start: { $gte: sixMonthsAgo }
        }).populate({
            path: 'bikes.id',
            populate: [
                { path: 'idModello', select: 'prezzo' }
            ]
        }).populate({
                path: 'bikes.assicurazione',
                model: 'Insurance',
                select: 'prezzo'
        }).populate({
                path: 'bikes.accessori',
                model: 'Accessory',
                select: 'prezzo'
        });

        //console.log(prenotazioni[0].bikes[0])

        let currentMonthBookings = 0;
        let currentMonthRevenue = 0;
        let bikesInUse = 0;
        let bikesInMaintenance = 0;

        const monthlyRevenue = new Array(6).fill(0);
        const monthlyBookings = new Array(6).fill(0);

        for (const p of prenotazioni) {
            const startDate = new Date(p.start);
            const monthDiff = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());

            // Calcola la durata in ore
            const durationHours = (new Date(p.stop).getTime() - new Date(p.start).getTime()) / (1000 * 60 * 60);

            // Prezzo per prenotazione
            let bookingTotal = 0;
            for (const bike of p.bikes) {
                const modelPrice = bike.id?.idModello?.prezzo || 0;
                const quantity = bike.quantity || 1;
                const accessoriesPrice = (bike.accessori as any[])?.reduce((sum, a) => sum + (a.prezzo || 0), 0) || 0;
                const insurancePrice = (bike.assicurazione as any)?.prezzo || 0;

                bookingTotal += ((modelPrice ) * quantity * durationHours)+accessoriesPrice + insurancePrice;
            }

            // Ricavi e conteggi mese corrente
            if (startDate >= startOfMonth && startDate < startOfNextMonth) {
                currentMonthBookings += 1;
                currentMonthRevenue += bookingTotal;
            }

            // Ricavi e conteggi ultimi 6 mesi
            if (monthDiff >= 0 && monthDiff < 6) {
                monthlyRevenue[5 - monthDiff] += bookingTotal;
                monthlyBookings[5 - monthDiff] += 1;
            }

            // Stato attuale
            if (p.status === 'In corso' && new Date(p.start) <= now && new Date(p.stop) >= now) {
                bikesInUse += p.bikes.reduce((sum, b) => sum + (b.quantity || 0), 0);
            }

            if (p.manutenzione) {
                bikesInMaintenance += p.bikes.reduce((sum, b) => sum + (b.quantity || 0), 0);
            }
        }

        res.status(200).json({
            prenotazioniMeseCorrente: currentMonthBookings,
            ricaviMeseCorrente: currentMonthRevenue,
            biciInNoleggio: bikesInUse,
            biciInManutenzione: bikesInMaintenance,
            ricaviUltimi6Mesi: monthlyRevenue,
            prenotazioniUltimi6Mesi: monthlyBookings
        });

    } catch (err) {
        next(err);
    }
};


//--------BACKUP BASE
// export const insertBooking = async (req: Request, res: Response, next: NextFunction) => {

//     // if (!req.user?.isOperator)
//     //     return res.status(401);
//     try {
//         const booking = req.body;

//         const newBooking = await PrenotazioneModel.create(booking);

//         res.status(201).json({ 'message': 'Booking created', 'data': newBooking });
//     }

//     catch (err) {
//         next(err);
//     }
// }



export const insertBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bikes, start, stop } = req.body;

    if (!start || !stop || !bikes || !Array.isArray(bikes) || bikes.length === 0) {
      return res.status(400).json({ message: 'Dati mancanti o errati nella richiesta' });
    }

    // Verifica disponibilità per ogni modello di bici richiesto
    for (const bike of bikes) {
      const modelId = bike.id;
      const quantityRequested = bike.quantity ?? 1;

      // Trova le prenotazioni sovrapposte per questo modello
      const prenotazioni = await PrenotazioneModel.find({
        'bikes.id': modelId,
        $or: [
          {
            start: { $lt: stop },
            stop: { $gt: start }
          }
        ],
        status: { $ne: 'cancellata' } // ignora cancellate, opzionale
      });

      // Calcola le quantità già prenotate per questo modello
      let quantityBooked = 0;
      for (const pren of prenotazioni) {
        for (const b of pren.bikes) {
          if (b.id.toString() === modelId) {
            quantityBooked += b.quantity ?? 1;
          }
        }
      }

      // Trova la quantità disponibile in totale per questo modello
      const bikeModel = await BikeModel.findById(modelId);
      if (!bikeModel) {
        return res.status(404).json({ message: `Modello bici non trovato: ${modelId}` });
      }

      const available = bikeModel.quantity - quantityBooked;
      if (quantityRequested > available) {
        return res.status(409).json({
          message: `Quantità non disponibile per il modello ${modelId}`,
          disponibili: available,
          richiesti: quantityRequested
        });
      }
    }

    // Tutto OK → crea la prenotazione
    const nuovaPrenotazione = await PrenotazioneModel.create(req.body);

    res.status(201).json({ message: 'Prenotazione creata', data: nuovaPrenotazione });

  } catch (err) {
    next(err);
  }
};

export const insertLoggedBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booking = req.body;

        if (!req.user?.id) {
            return res.status(400).json({ message: 'User non passato' });
        }

        booking.idUser = req.user.id;

        const newBooking = await PrenotazioneModel.create(booking);

        const fullBooking = await PrenotazioneModel.findById(newBooking._id)
            .populate({ path: 'idUser', select: '-password -__v' })
            .populate({ path: 'pickupLocation', select: '-__v' })
            .populate({ path: 'dropLocation', select: '-__v' })
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
            }) as any;

        if (!fullBooking) {
            return res.status(500).json({ message: 'Errore interno: prenotazione non trovata.' });
        }

        const recapHtml = `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; background-color: #fff; padding: 20px; border: 1px solid #eee; max-width: 600px; margin: auto;">
                <div style="background-color: #c4001a; color: white; padding: 15px; text-align: center; border-radius: 6px 6px 0 0;">
                <h2 style="margin: 0;">Conferma Prenotazione</h2>
                </div>

                <div style="padding: 20px;">
                <p>Ciao <strong>${fullBooking.idUser.name}</strong>,</p>
                <p>La tua prenotazione è stata registrata con successo. Ecco i dettagli:</p>

                <div style="margin-top: 20px;">
                    <h3 style="color: #c4001a;">📅 Periodo</h3>
                    <p><strong>Dal:</strong> ${new Date(fullBooking.start).toLocaleDateString()}<br/>
                    <strong>Al:</strong> ${new Date(fullBooking.stop).toLocaleDateString()}</p>

                    <h3 style="color: #c4001a;">📍 Location</h3>
                    <p><strong>Ritiro:</strong> ${fullBooking.pickupLocation?.location}<br/>
                    <strong>Riconsegna:</strong> ${fullBooking.dropLocation?.location}</p>

                    <h3 style="color: #c4001a;">🚲 Dettagli Bici</h3>
                    <ul style="list-style: none; padding: 0;">
                    ${fullBooking.bikes.map((b: any) => `
                        <li style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                        <strong>${b.quantity}x</strong> ${b.id?.idModello?.descrizione} <em>(${b.id?.idModello?.type})</em><br/>
                        ${b.accessori?.length ? `<span>🔧 <strong>Accessori:</strong> ${b.accessori.map((a: any) => a.descrizione).join(', ')}</span><br/>` : ''}
                        ${b.assicurazione ? `🛡️ <strong>Assicurazione:</strong> ${b.assicurazione.descrizione}` : ''}
                        </li>
                    `).join('')}
                    </ul>

                    <h3 style="color: #c4001a;">📌 Stato</h3>
                    <p><strong>${fullBooking.status}</strong></p>
                </div>
                </div>

                <div style="background-color: #f8f8f8; padding: 10px; text-align: center; font-size: 12px; color: #555; border-radius: 0 0 6px 6px;">
                RideClone | Prenotazione Biciclette
                </div>
            </div>
            `;


        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: fullBooking.idUser.email,
            subject: 'Conferma Prenotazione Biciclette',
            html: recapHtml
        });

        return res.status(201).json({ message: 'Prenotazione creata', data: fullBooking });

    } catch (err) {
        next(err);
    }
};


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