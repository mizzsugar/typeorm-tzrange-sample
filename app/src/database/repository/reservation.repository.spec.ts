import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ReservationRepository } from './reservation.repository';
import { CarEntity } from '~/database/entity/car.entity';
import { ReservationEntity } from '~/database/entity/reservation.entity';

describe('ReservationRepository', () => {
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
     providers: [ReservationRepository],
   }).compile();

   dataSource = moduleRef.get<DataSource>(DataSource);
   reservationRepository = moduleRef.get<ReservationRepository>(ReservationRepository);
 });

 describe('checkIfCarIsAvailable', () => {
    let car: CarEntity;
   
    beforeEach(async () => {
      const manager = dataSource.createEntityManager();
      car = await manager.save(CarEntity, { name: 'car name', model: 'car model', manufacturingYear: 2021 });
      
      await reservationRepository.create(
        { carId: car.id, startTime: '2024-01-20T10:00:00+09:00', endTime: '2024-01-20T12:00:00+09:00' },
        manager
      );
    });
 
    afterEach(async () => {
      const manager = dataSource.createEntityManager();
    await dataSource.query('TRUNCATE TABLE reservations CASCADE');
    await dataSource.query('TRUNCATE TABLE cars CASCADE');
    });
 
    it('予約時間が重複しない場合はtrueを返す', async () => {
      const manager = dataSource.createEntityManager();
      car = await manager.save(CarEntity, { name: 'car name', model: 'car model', manufacturingYear: 2021 });
      
      const result = await reservationRepository.checkIfCarIsAvailable(
        car.id,
        '2024-01-20T13:00:00+09:00',
        '2024-01-20T15:00:00+09:00',
        manager
      );
      expect(result).toBe(true);
    });
 
    it('予約時間が完全に重複する場合はfalseを返す', async () => {
      const manager = dataSource.createEntityManager();
      const result = await reservationRepository.checkIfCarIsAvailable(
        car.id,
        '2024-01-20T10:00:00+09:00',
        '2024-01-20T12:00:00+09:00',
        manager
      );
      expect(result).toBe(false);
    });
 
    it('予約時間が部分的に重複する場合はfalseを返す', async () => {
      const manager = dataSource.createEntityManager();
      const result = await reservationRepository.checkIfCarIsAvailable(
        car.id,
        '2024-01-20T11:00:00+09:00',
        '2024-01-20T13:00:00+09:00',
        manager
      );
      expect(result).toBe(false);
    });
 
    it('予約時間が連続する場合はfalseを返す', async () => {
      const manager = dataSource.createEntityManager();
      const result = await reservationRepository.checkIfCarIsAvailable(
        car.id,
        '2024-01-20T12:00:00+09:00',
        '2024-01-20T14:00:00+09:00',
        manager
      );
      expect(result).toBe(false);
    });
 });
});
