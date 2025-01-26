import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CarEntity } from "~/database/entity/car.entity";
import { CreateCarDto } from "~/car/dto/create-car.dto";

@Injectable()
export class CarRepository {
  constructor(
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>
  ) {}

  async create(createCarDto: CreateCarDto): Promise<CarEntity> {
    const car = new CarEntity();
    car.name = createCarDto.name;
    car.model = createCarDto.model;
    car.manufacturingYear = createCarDto.manufacturingYear;

    return this.carRepository.save(car);
  }

  async findOne(id: number): Promise<CarEntity | null> {
    return this.carRepository.findOneBy({ id: id });
  }

  async findAvaliableCars(startTime: string, endTime: string): Promise<CarEntity[]> {
    const timeRange = `[${startTime},${endTime}]`;

    return this.carRepository.createQueryBuilder('car')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('reservation.car_id')
          .from('reservations', 'reservation')
          .where('reservation.reservation_time && :timeRange::tstzrange')
          .getQuery();
        return `car.id NOT IN ${subQuery}`;
      })
      .setParameter('timeRange', timeRange)
      .getMany();
  }
}