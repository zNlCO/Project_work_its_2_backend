import 'reflect-metadata';

import app from './app';
import mongoose from 'mongoose';

mongoose.set('debug', true);
mongoose.connect('mongodb://127.0.0.1:27017/simulazione-permessi')
  .then(_ => {
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch(err => {
    console.error(err);
  });