import { Type } from "class-transformer";
import { IsDate, IsEmail, IsMongoId, IsOptional, IsString, IsUrl, Matches, MinLength } from "class-validator";

export class AddUserDTO {
  @IsString()
  lastName: string;

  @IsString()
  firstName: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  openingDate: Date;

  @IsString()
  @Type(() => String)
  @IsOptional()
  IBAN: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  @Matches(
    new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$'),
    {
      message: 'Password non sicura, deve contenere almeno un lettera maiuscola, una minuscola, un numero e un carattere speciale'
    }
  )
  password: string;

}


export class LoginDTO {

    @IsEmail()
    email: string;
  
    @IsString()
    password: string;
  }


export class changeDTO {

  @IsString()
  currentPassword: string;

  @MinLength(8)
  @Matches(
    new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$'),
    {
      message: 'Password non sicura, deve contenere almeno un lettera maiuscola, una minuscola, un numero e un carattere speciale'
    }
  )
  newPassword: string;
}