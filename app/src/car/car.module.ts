import { Module } from '@nestjs/common';
import { CarService } from '~/car/car.service';
import { CarController } from '~/car/car.controller';
import { DatabaseModule } from '~/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
