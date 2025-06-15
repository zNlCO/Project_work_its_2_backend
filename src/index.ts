import 'reflect-metadata';
import app from './app';
import mongoose from 'mongoose';
import { startBookingStatusUpdater } from './api/utils/bookingStatusUpdater'; // <-- importa lo script

mongoose.set('debug', true);
mongoose.connect('mongodb+srv://admin:plvc04062025@cluster0.infxx2t.mongodb.net/cloneride')
  .then(_ => {
    const port = 3001;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
      startBookingStatusUpdater(); // <-- avvia lo script qui
    });
  })
  .catch(err => {
    console.error(err);
  });
