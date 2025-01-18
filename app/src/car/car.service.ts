import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';

@Injectable()
export class CarService {
  create(createCarDto: CreateCarDto) {
    return 'This action adds a new car';
  }

  findAll() {
    return `This action returns all car`;
  }

  findOne(id: number) {
    return `This action returns a #${id} car`;
  }

  searchAvailableCars() {
    return `available cars`;
  }
}
