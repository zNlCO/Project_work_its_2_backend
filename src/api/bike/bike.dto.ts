import { IsISO8601, IsMongoId, IsString } from "class-validator";

export class FilterDateLocationDTO {
    @IsISO8601()
    start: Date;

    @IsISO8601()
    end: Date;

    @IsMongoId()
    pickup_location: string;
}


export class AddBikeDTO {
    @IsMongoId()
    idPuntoVendita: string;

    @IsMongoId()
    idModello: string;

    quantity: number
}