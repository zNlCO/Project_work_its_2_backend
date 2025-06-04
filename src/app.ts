import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import "./utils/auth/auth-handlers";
import apiRouter from "./api/routes";
import { errorHandlers } from "./errors";
const app = express();
const path = require('path');

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public', 'front-end', 'browser')));


app.use('/api', apiRouter);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'front-end', 'browser', 'index.html'));
});


app.use(errorHandlers);

export default app;