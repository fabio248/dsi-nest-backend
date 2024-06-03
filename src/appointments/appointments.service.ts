import { Injectable } from '@nestjs/common';
import { Appointment } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { CreateAppointmentInput } from './dto/input';
import { PrismaService } from '../database/database.service';
import { UsersService } from '../users/users.service';
import {
  AppointmentWithUserResponseDto,
  AppointmentResponseDto,
} from './dto/response';
import {
  AppointmentNotFound,
  InvalidDateAppointmentException,
} from './exception';
import { FindAllAppointmentArgs } from './dto/arg/find-all.args';
import { TransformStringToDate } from '../shared/utils/transform-date.utils';

@Injectable()
export class AppointmentsService {
  private infoClientToInclude = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
  };

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentInput,
  ): Promise<AppointmentWithUserResponseDto> {
    const { emailClient, startDate, endDate } = createAppointmentDto;
    createAppointmentDto.emailClient = undefined;

    await this.userService.findOneByEmail(emailClient);

    const listAppointments = await this.prismaService.appointment.findMany();

    const isValidDateAppointment = this.validateDateAppointment(
      createAppointmentDto,
      listAppointments,
    );

    if (!isValidDateAppointment) {
      throw new InvalidDateAppointmentException();
    }

    createAppointmentDto.startDate = TransformStringToDate(startDate as string);
    createAppointmentDto.endDate = TransformStringToDate(endDate as string);

    const appointment = await this.prismaService.appointment.create({
      data: {
        ...createAppointmentDto,
        client: { connect: { email: emailClient } },
      },
      include: {
        client: {
          select: this.infoClientToInclude,
        },
      },
    });

    return plainToInstance(AppointmentWithUserResponseDto, appointment);
  }

  validateDateAppointment(
    newAppointment: CreateAppointmentInput,
    existingAppointments: Appointment[],
  ): boolean {
    const startDate = TransformStringToDate(newAppointment.startDate as string);
    const endDate = TransformStringToDate(newAppointment.endDate as string);

    if (startDate <= new Date()) {
      return false;
    }

    for (const appointment of existingAppointments) {
      if (
        appointment.startDate.toISOString().substr(0, 10) ===
        startDate.toISOString().substr(0, 10)
      ) {
        if (
          (appointment.startDate <= startDate &&
            startDate < appointment.endDate) ||
          (appointment.startDate < endDate && endDate <= appointment.endDate) ||
          (startDate <= appointment.startDate &&
            appointment.startDate < endDate) ||
          (startDate < appointment.endDate && appointment.endDate <= endDate)
        ) {
          return false; // Conflict found
        }
      }
    }
    return true; // No conflicts found
  }

  async findAll(
    args: FindAllAppointmentArgs,
  ): Promise<AppointmentWithUserResponseDto[]> {
    const { skip, take, email } = args;

    const listAppointments = await this.prismaService.appointment.findMany({
      skip,
      take,
      where: {
        client: { email },
      },
      include: {
        client: {
          select: this.infoClientToInclude,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return listAppointments.map((appointment: Appointment) =>
      plainToInstance(AppointmentWithUserResponseDto, appointment),
    );
  }

  async findOne(id: number): Promise<AppointmentWithUserResponseDto> {
    const appointment = await this.prismaService.appointment.findUnique({
      where: { id },
      include: {
        client: {
          select: this.infoClientToInclude,
        },
      },
    });

    if (!appointment) {
      throw new AppointmentNotFound(id);
    }

    return plainToInstance(AppointmentWithUserResponseDto, appointment);
  }

  async remove(id: number): Promise<AppointmentResponseDto> {
    await this.findOne(id);

    const deletedAppointment = await this.prismaService.appointment.delete({
      where: { id },
    });

    return plainToInstance(AppointmentResponseDto, deletedAppointment);
  }
}
