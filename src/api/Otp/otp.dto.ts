import { IsEmail, IsString } from "class-validator";

export class VerifyOtpDto {

    @IsEmail()
    email: string;
  
    @IsString()
    otp: string;

  }

export class SendOtpDto {

  @IsEmail()
  email: string;

}