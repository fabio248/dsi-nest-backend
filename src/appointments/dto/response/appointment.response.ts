import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

export class AppointmentResponseDto {
  @Expose()
  name: string;

  /**
   * Format: dd/mm/yyyy HH:MM:SS AM/PM
   * @example 14/07/2023 03:15:00 PM
   */
  @Expose()
  @Transform(({ value }) =>
    value.toLocaleString('es-ES', { timeZone: 'America/El_Salvador' }),
  )
  startDate: string;

  /**
   * Format: dd/mm/yyyy HH:MM:SS AM/PM
   * @example 20/07/2023 011:15:00 AM
   */
  @Expose()
  @Transform(({ value }) =>
    value.toLocaleString('es-ES', { timeZone: 'America/El_Salvador' }),
  )
  endDate: string;

  @Expose()
  description: string;

  @Expose()
  id: number;

  @Expose()
  clientId: number;

  @Exclude()
  @ApiHideProperty()
  createdAt: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt: Date;
}
