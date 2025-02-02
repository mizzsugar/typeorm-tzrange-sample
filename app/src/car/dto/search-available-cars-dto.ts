import { IsISO8601, IsNotEmpty, Validate, ValidateIf } from 'class-validator';
export class SearchAvailableCarsDto {
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
