import { ClientResponseDto } from './client.response';
import { AppointmentResponseDto } from './appointment.response';
import { Type } from 'class-transformer';

export class AppointmentWithUserResponseDto extends AppointmentResponseDto {
  @Type(() => ClientResponseDto)
  client?: ClientResponseDto;
}
