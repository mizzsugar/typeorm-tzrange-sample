import { IsNumber, IsNotEmpty, IsISO8601 } from 'class-validator';

export class CreateReservationDto {
    @IsNumber()
    @IsNotEmpty()
    car_id: number;
  
    @IsISO8601()
    @IsNotEmpty()
    startTime: string;
  
    @IsISO8601()
    @IsNotEmpty()
    endTime: string;
}
  