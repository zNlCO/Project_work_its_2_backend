import "reflect-metadata";
import { getEnvVariable } from "./utils/db/envVariableControl";
import dotenv from "dotenv";
import app from "./app";
import mongoose from "mongoose";



mongoose.set("debug", true);
mongoose
  .connect(`mongodb+srv://karimlaakroud:N0OY7tdMALlPDnKN@karim.y3ogwl5.mongodb.net/?retryWrites=true&w=majority&appName=karim`)
  .then(_ => {
    app.listen(3000, () => {
      console.log(
        `Server started on port 3000`
      );
    });
  })
  .catch((err) => {
    console.error(err);
  });
