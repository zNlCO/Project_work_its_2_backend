import { Router } from "express";
import { validate } from "../../utils/validation-middleware";
import { VerifyOtpDto, SendOtpDto } from "./otp.dto";
import { sendOtp, verifyOtp } from "./otp.controller";


const router = Router();

router.post('/verify', validate(VerifyOtpDto), verifyOtp);
router.post('/send', validate(SendOtpDto), sendOtp);

export default router;