import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentInput } from './dto/input';
import { ApiTags } from '@nestjs/swagger';
import { FindAllAppointmentArgs } from './dto/arg/find-all.args';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentInput) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(@Query() args: FindAllAppointmentArgs) {
    return this.appointmentsService.findAll(args);
  }

  @Get(':appointmentId')
  findOne(@Param('appointmentId') appointmentId: number) {
    return this.appointmentsService.findOne(appointmentId);
  }

  @Delete(':appointmentId')
  remove(@Param('appointmentId') appointmentId: number) {
    return this.appointmentsService.remove(appointmentId);
  }
}
