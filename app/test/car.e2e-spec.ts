import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '~/app.module';
import { CarEntity } from '~/database/entity/car.entity';
import { DataSource } from 'typeorm';

describe('CarController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();
  });

  afterEach(async () => {
    await dataSource.query('TRUNCATE TABLE reservations CASCADE');
    await dataSource.query('TRUNCATE TABLE cars CASCADE');
  });

  it('can register and get a car', async () => {
    const createRes: { body: CarEntity } = await request(app.getHttpServer())
      .post('/car')
      .send({"name": "car name", "model": "car model", "manufacturingYear": 2021})
      .expect(201);

    const createdBody = createRes.body;

    expect(createdBody.name).toEqual("car name");
    expect(createdBody.model).toEqual("car model");
    expect(createdBody.manufacturingYear).toEqual(2021);

    const getRes: { body: CarEntity } = await request(app.getHttpServer())
      .get(`/car/${createdBody.id}`)
      .expect(200);

    const gottenBody = getRes.body;
    expect(gottenBody.name).toEqual("car name");
    expect(gottenBody.model).toEqual("car model");
    expect(gottenBody.manufacturingYear).toEqual(2021);
  });

  it('search available cars', async () => {
    const car1 = await request(app.getHttpServer())
      .post('/car')
      .send({"name": "car name1", "model": "car model1", "manufacturingYear": 2021})
      .expect(201);

    const car2 = await request(app.getHttpServer())
      .post('/car')
      .send({"name": "car name2", "model": "car model2", "manufacturingYear": 2022})
      .expect(201);

    const car3 = await request(app.getHttpServer())
      .post('/car')
      .send({"name": "car name3", "model": "car model3", "manufacturingYear": 2023})
      .expect(201);

    await request(app.getHttpServer())
      .post('/reservation')
      .send({"carId": car1.body.id, "startTime": "2024-01-22T10:00:00+09:00", "endTime": "2024-01-22T12:00:00+09:00"})
      .expect(201);

    await request(app.getHttpServer())
      .post('/reservation')
      .send({"carId": car2.body.id, "startTime": "2024-01-22T13:00:00+09:00", "endTime": "2024-01-22T14:00:00+09:00"})
      .expect(201);

    await request(app.getHttpServer())
      .post('/reservation')
      .send({"carId": car3.body.id, "startTime": "2024-01-22T14:00:00+09:00", "endTime": "2024-01-22T15:00:00+09:00"})
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/car/search')
      .send({"startTime": "2024-01-22T13:00:00+09:00", "endTime": "2024-01-22T15:00:00+09:00"})
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(car1.body.id);
  })
});
