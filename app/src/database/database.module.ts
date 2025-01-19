import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from './entity/car.entity';
import { ReservationEntity } from './entity/reservation.entity';
import { CarRepository } from './repository/car.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarEntity, ReservationEntity])
  ],
  providers: [CarRepository],
  exports: [CarRepository],
})
export class DatabaseModule {}
