import { PartialType } from '@nestjs/swagger';
import { CreateAppointmentInput } from './create-appointment.input';

export class UpdateAppointmentInput extends PartialType(
  CreateAppointmentInput,
) {}
