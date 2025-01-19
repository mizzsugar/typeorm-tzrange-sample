import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationModule } from './reservation/reservation.module';
import { CarModule } from './car/car.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'postgres',
        port:  5432,
        username: 'postgres',
        password: 'password',
        database: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        timezone: 'utc',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      })
    }),
    CarModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
