import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentInput } from './dto/input';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllAppointmentArgs } from './dto/arg/find-all.args';
import RoleGuard from '../auth/guards/role.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(RoleGuard(UserRole.admin))
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiBearerAuth()
  create(@Body() createAppointmentDto: CreateAppointmentInput) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiBearerAuth()
  findAll(@Query() args: FindAllAppointmentArgs) {
    return this.appointmentsService.findAll(args);
  }

  @Get(':appointmentId')
  @ApiBearerAuth()
  findOne(@Param('appointmentId') appointmentId: number) {
    return this.appointmentsService.findOne(appointmentId);
  }

  @Delete(':appointmentId')
  @ApiBearerAuth()
  remove(@Param('appointmentId') appointmentId: number) {
    return this.appointmentsService.remove(appointmentId);
  }
}
