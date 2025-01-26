import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarRepository } from './car.repository';
import { CarEntity } from '~/database/entity/car.entity';
import { ReservationEntity } from '~/database/entity/reservation.entity';
import { ReservationRepository } from './reservation.repository';
import { DataSource } from 'typeorm';

describe('CarRepository', () => {
    let carRepository: CarRepository;
    let reservationRepository: ReservationRepository;
    let dataSource: DataSource;

 beforeAll(async () => {
   const moduleRef = await Test.createTestingModule({
     imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'postgres',
            port: 5432,
            username: 'postgres',
            password: 'password',
            database: 'postgres',
            entities: [CarEntity, ReservationEntity],
            synchronize: true,
          }),
       TypeOrmModule.forFeature([CarEntity, ReservationEntity]),
     ],
     providers: [CarRepository, ReservationRepository],
   }).compile();

   dataSource = moduleRef.get<DataSource>(DataSource);
   carRepository = moduleRef.get<CarRepository>(CarRepository);
   reservationRepository = moduleRef.get<ReservationRepository>(ReservationRepository);
 });

 afterEach(async () => {
  await dataSource.query('TRUNCATE TABLE reservations CASCADE');
  await dataSource.query('TRUNCATE TABLE cars CASCADE');
 });

 describe('findAvaliableCars', () => {
    it('指定した時間すべて空いている車を返す', async () => {
      const car1 = await carRepository.create({ name: 'hoge', model: 'car model1', manufacturingYear: 2021 });
      const car2 = await carRepository.create({ name: 'fuga', model: 'car model2', manufacturingYear: 2022 });
      const car3 = await carRepository.create({ name: 'piyo', model: 'car model3', manufacturingYear: 2023 });

      // findAvaliableCarsで指定されている時間に予約が入っていないので車が返される
      await reservationRepository.create({ carId: car1.id, startTime: '2024-01-22T10:00:00+09:00', endTime: '2024-01-22T12:00:00+09:00'});

      // findAvaliableCarsで指定されている時間に予約が入っていないので車が返されない
      await reservationRepository.create({ carId: car2.id, startTime: '2024-01-22T13:00:00+09:00', endTime: '2024-01-22T14:00:00+09:00'});
      await reservationRepository.create({ carId: car3.id, startTime: '2024-01-22T14:00:00+09:00', endTime: '2024-01-22T15:00:00+09:00'});

      const result = await carRepository.findAvaliableCars('2024-01-22T13:00:00+09:00', '2024-01-22T15:00:00+09:00');
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(car1.id);
    });

 });
});
