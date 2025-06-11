import { IsBoolean, IsEmail, IsString, Matches, MinLength } from "class-validator";

export class LoginDTO {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class AddUserDTO {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @MinLength(8)
    @Matches(
        new RegExp('^(?=.*[a-z])(?=.*[A-Z])((?=.*\\d)|(?=.*\\W)).*$'),
        {
            message: 'password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number or special character'
        }
    )
    password: string;
}