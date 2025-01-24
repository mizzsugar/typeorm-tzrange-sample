import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";

import { ReservationEntity } from "../entity/reservation.entity";
import { CreateReservationDto } from "~/reservation/dto/create-reservation.dto";

@Injectable()
export class ReservationRepository {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>
  ) {}

  async create(createReservationDto: CreateReservationDto, manager?: EntityManager): Promise<ReservationEntity> {
    const repo = manager?.getRepository(ReservationEntity) ?? this.reservationRepository;
    const reservation = new ReservationEntity();
    const timeRange = `[${createReservationDto.startTime},${createReservationDto.endTime}]`;
    reservation.car_id = createReservationDto.carId;
    reservation.reservation_time = timeRange;
    return repo.save(reservation);
  }

  async checkIfCarIsAvailable(carId: number, startTime: string, endTime: string, manager?: EntityManager): Promise<boolean> {
    const repo = manager?.getRepository(ReservationEntity) ?? this.reservationRepository;
    const timeRange = `[${startTime},${endTime}]`;
    const conflictingReservation = await repo
      .createQueryBuilder('reservation')
      .where('reservation.car_id = :carId', { carId: carId })
      .andWhere('reservation.reservation_time && :timeRange::tstzrange', { 
        timeRange 
      })
      .getOne();
    return !conflictingReservation;
  }

  async findOne(id: number): Promise<ReservationEntity | null> {
    return this.reservationRepository.findOneBy({id: id});
  }
}