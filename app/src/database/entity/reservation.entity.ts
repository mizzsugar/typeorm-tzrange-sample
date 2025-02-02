
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { CarEntity } from "./car.entity";

@Entity({ name: 'reservations' })
export class ReservationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    @JoinColumn({ name: "car_id" })
    car_id: number;

    @Column({ type: 'tstzrange' })
    @Index({ spatial: true })  // GiSTインデックスを作成するため
    reservation_time: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => CarEntity)
    @JoinColumn({ name: 'car_id' })
    car: CarEntity;
}
