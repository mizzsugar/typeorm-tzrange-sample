import { Module } from '@nestjs/common';
import { ReservationService } from '~/reservation/reservation.service';
import { ReservationController } from '~/reservation/reservation.controller';
import { DatabaseModule } from '~/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
