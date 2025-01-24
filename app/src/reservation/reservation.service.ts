import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { ReservationRepository } from '~/database/repository/reservation.repository';
import { CreateReservationDto } from '~/reservation/dto/create-reservation.dto';

@Injectable()
export class ReservationService {

  constructor(
    @Inject(ReservationRepository) private readonly reservationRepository: ReservationRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isAvailable = await this.reservationRepository.checkIfCarIsAvailable(
        createReservationDto.carId,
        createReservationDto.startTime,
        createReservationDto.endTime,
        queryRunner.manager
      );

      if (!isAvailable) {
        throw new ConflictException('この時間帯は既に予約されています');
      }

      const reservation = await this.reservationRepository.create(
        createReservationDto,
        queryRunner.manager
      );

      await queryRunner.commitTransaction();
      return reservation;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;

    } finally {
      await queryRunner.release();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }
}
