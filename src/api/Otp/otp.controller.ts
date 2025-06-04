import { Response, NextFunction } from "express";
import { TypedRequest } from "../../utils/typed-request";
import { SendOtpDto, VerifyOtpDto } from "./otp.dto";
import OtpService from "./otp.service";

export const sendOtp = async (req: TypedRequest<SendOtpDto>, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
        const jsonOtp = await OtpService.sendOtp(email, otp);
        res.json(jsonOtp);
            
    }
    catch (err) {
        next(err);
    }
}

export const verifyOtp = async (req: TypedRequest<VerifyOtpDto>, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;
        
        const jsonOtp = await OtpService.verifyOtp(email, otp);

        res.json(jsonOtp);  
    }
    catch (err) {
        next(err);
    }
}