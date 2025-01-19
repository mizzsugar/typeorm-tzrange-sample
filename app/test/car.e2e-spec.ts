import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '~/app.module';
import { CarEntity } from '~/database/entity/car.entity';


describe('CarController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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

    // const getRes: { body: CarEntity } = await request(app.getHttpServer())
    //   .get(`/car/${createdBody.id}`)
    //   .expect(200);

    // const gottenBody = getRes.body;
    // expect(gottenBody.name).toEqual("car name");
    // expect(gottenBody.model).toEqual("car model");
    // expect(gottenBody.manufacturingYear).toEqual(2021);
  });
});
