import { Controller, Get, Post, Body, Param, NotFoundException, HttpCode } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { SearchAvailableCarsDto } from './dto/search-available-cars-dto';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get()
  findAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    const car =  this.carService.findOne(+id);
    if (!car) {
      throw new NotFoundException();
    }
    return car;
  }

  @Post('search')
  @HttpCode(200)
  searchAvailableCars(@Body() request: SearchAvailableCarsDto) {
    return this.carService.searchAvailableCars(request.startTime, request.endTime);
  }
}
