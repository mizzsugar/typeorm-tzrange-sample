import { Inject, Injectable } from '@nestjs/common';
import { CreateCarDto } from '~/car/dto/create-car.dto';
import { CarEntity } from '~/database/entity/car.entity';
import { CarRepository } from "~/database/repository/car.repository";

@Injectable()
export class CarService {
  constructor(
    @Inject(CarRepository) private readonly carRepository: CarRepository
  ) {}

  async create(createCarDto: CreateCarDto): Promise<CarEntity> {
    return this.carRepository.create(createCarDto);
  }

    findAll(): CarEntity[] {
      return [];
    }

    findOne(id: number): CarEntity {
      return null;
    }

    searchAvailableCars(): CarEntity[] {
      return [];
    }
}
