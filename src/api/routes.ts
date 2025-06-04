import express from "express";
import CategorieMovimentiRouter from "./CategorieMovimenti/categorieMovimenti.router";
import MovimentiContiCorrentiRouter from "./MovimentiContiCorrenti/movimentiContiCorrenti.router";
import ContiCorrenti from "./ContiCorrenti/contiCorrenti.routes";
import OtpRouter from "./Otp/otp.routes";
import authRoute from "./auth/auth.routes";
import logRouter from "./log/log.router";

const router = express.Router();

router.use("/categorie-movimenti", CategorieMovimentiRouter);
router.use("/movimenti-conti-correnti", MovimentiContiCorrentiRouter);
router.use("/conti-correnti", ContiCorrenti);
router.use("/otp", OtpRouter);
router.use('/logs', logRouter)
router.use(authRoute)

export default router;
