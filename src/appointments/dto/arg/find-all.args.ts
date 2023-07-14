import { IsEmail, IsOptional } from 'class-validator';
import { GenericArgs } from '../../../shared/args/generic.args';

export class FindAllAppointmentArgs extends GenericArgs {
  /**
   * Set email when you want to get all appointments specific client
   */
  @IsEmail()
  @IsOptional()
  email?: string;
}
