import { IsISO8601, IsString } from "class-validator";

export class FilterDateLocationDTO {
    @IsISO8601()
    start: Date;

    @IsISO8601()
    end: Date;

    @IsString()
    pickup_location: string;
}