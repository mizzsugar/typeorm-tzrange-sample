import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationModule } from './reservation/reservation.module';
import { CarModule } from './car/car.module';

@Module({
  imports: [ReservationModule, CarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
