import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '~/app.module';
import { CarEntity } from '~/database/entity/car.entity';
import { ReservationResponseDto } from '~/reservation/dto/reservation-response.dto';

describe('ReservatoinController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('can make a reservation if available', async () => {
        const createCarRes: { body: CarEntity } = await request(app.getHttpServer())
        .post('/car')
        .send({"name": "car name", "model": "car model", "manufacturingYear": 2021})
        .expect(201);
  
        const createCarResBody = createCarRes.body;

        const createReservationRes: { body: ReservationResponseDto } = await request(app.getHttpServer())
            .post('/reservation')
            .send({"carId": createCarResBody.id, "startTime": "2024-01-20T10:00:00+09:00", "endTime": "2024-01-20T12:00:00+09:00"})
            .expect(201);
            const createReservationResBody = createReservationRes.body;

        expect(createReservationResBody.carId).toEqual(createCarResBody.id);
        expect(createReservationResBody.startTime).toEqual("2024-01-20T10:00:00+09:00");
        expect(createReservationResBody.endTime).toEqual("2024-01-20T12:00:00+09:00");
    });
});
