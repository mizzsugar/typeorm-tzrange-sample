export class ReservationResponseDto {
    id: number;
    carId: number;
    startTime: string;
    endTime: string;
   
    constructor(id: number, carId: number, startTime: string, endTime: string) {
      this.id = id;
      this.carId = carId;
      this.startTime = startTime;
      this.endTime = endTime;
    }
   
    static fromEntity(reservation: any): ReservationResponseDto {
      const timeRange = reservation.reservation_time
        .replace('[', '')
        .replace(']', '')
        .split(',');
      
      return new ReservationResponseDto(
        reservation.id,
        reservation.car_id,
        timeRange[0],
        timeRange[1]
      );
    }
   }