import { Type } from "class-transformer";
import { IsDate, IsMongoId, IsOptional } from "class-validator";

export class updateIBAN {
    @IsMongoId()
    id: string;

    @IsMongoId()
    @Type(() => String)
    IBAN: string;
}