import { IsNumber, IsNotEmpty, IsISO8601, ValidateIf, Validate } from 'class-validator';

export class CreateReservationDto {
    @IsNumber()
    @IsNotEmpty()
    carId: number;
  
    @IsISO8601()
    @IsNotEmpty()
    startTime: string;
  
    @IsISO8601()
    @IsNotEmpty()
    @ValidateIf((_, value) => value !== undefined)
    @Validate((_, value) => value > _.startTime, {
        message: 'endTime must be greater than startTime',
    })
    endTime: string;
}
