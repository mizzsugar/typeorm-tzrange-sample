import { IsString, IsNumber, Min } from 'class-validator';


export class CreateCarDto {
    @IsString()
    name: string;

    @IsString()
    model: string;

    @IsNumber()
    @Min(1900)
    manufacturingYear: number;
}
