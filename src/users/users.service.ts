/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { Prisma, User } from '@prisma/client';
import {
  CreateUserInput,
  UpdateUserDto,
  CreateUserWithPetInput,
} from './dto/input';
import {
  UserNotFoundException,
  EmailAlreadyTakenException,
  InvalidCredentialsException,
} from './exception';
import { TransformStringToDate } from '../shared/utils/transform-date.utils';
import { FindAllUserArgs } from './dto/args/find-all-user.args';
import { PrismaService } from '../database/database.service';
import { UserWithPetResponseDto, UserResponseDto } from './dto/response';
import { MailerService } from '../mailer/mailer.service';
import { getWelcomeMail } from './utils/mails/welcome.mail';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async create(createUserDto: CreateUserInput): Promise<UserResponseDto> {
    this.logger.log('Create a user');

    const { birthday, email } = createUserDto;

    await this.thrwoErrorIfEmailIsAlreadyTaken(email);

    createUserDto.birthday = TransformStringToDate(birthday as string);

    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    this.sendWelcomeMail(user);

    return plainToInstance(UserResponseDto, user);
  }

  async createUserWithPet(
    createUserWithPetDto: CreateUserWithPetInput,
  ): Promise<UserWithPetResponseDto> {
    //@ts-ignore
    const createUserDto = { ...createUserWithPetDto, pet: undefined };
    const { pet, email } = createUserWithPetDto;
    const { medicalHistory } = pet;
    const { otherPet, food, physicalExam } = medicalHistory;

    await this.thrwoErrorIfEmailIsAlreadyTaken(email);

    pet.birthday = TransformStringToDate(pet.birthday as string);

    createUserDto.birthday = TransformStringToDate(
      createUserDto.birthday as string,
    );

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        pets: {
          create: {
            ...pet,
            medicalHistory: {
              create: {
                ...medicalHistory,
                food: {
                  create: food,
                },
                otherPet: {
                  create: otherPet,
                },
                physicalExam: {
                  create: physicalExam,
                },
              },
            },
            specie: { connect: { id: pet.specieId } },
            specieId: undefined as never,
          },
        },
      },
      include: {
        pets: {
          include: {
            medicalHistory: {
              include: { food: true, physicalExam: true, otherPet: true },
            },
          },
        },
      },
    });

    this.sendWelcomeMail(user);

    return plainToInstance(UserWithPetResponseDto, user);
  }

  async thrwoErrorIfEmailIsAlreadyTaken(email: string): Promise<void> {
    const isEmailAlreadyTaken = await this.prisma.user.findUnique({
      where: { email },
    });

    if (isEmailAlreadyTaken) {
      throw new EmailAlreadyTakenException(email);
    }
  }

  async findAll(args: FindAllUserArgs) {
    const { skip, take } = args;
    this.logger.log('Retrieve all users');

    const listUser = await this.prisma.user.findMany({ skip, take });

    return listUser.map((user) => plainToInstance(UserResponseDto, user));
  }

  async findOneById(id: number): Promise<UserResponseDto> {
    this.logger.log('Retrieve one user');

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundException({ id });
    }

    return plainToInstance(UserResponseDto, user);
  }

  async findOneWithSensitiveInfo(
    param: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    this.logger.log('Retrieve one user');

    const user = await this.prisma.user.findUnique({
      where: param,
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<UserResponseDto> {
    this.logger.log('Retrieve one user');

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UserNotFoundException({ email });
    }

    return plainToInstance(UserResponseDto, user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    this.logger.log('Update one user');
    await this.findOneById(id);

    if (updateUserDto.birthday) {
      updateUserDto.birthday = TransformStringToDate(
        updateUserDto.birthday as string,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return plainToInstance(UserResponseDto, updatedUser);
  }

  async remove(id: number): Promise<UserResponseDto> {
    this.logger.log('Delete one user');

    const user = await this.findOneById(id);

    this.prisma.user.delete({ where: { id } });

    return plainToInstance(UserResponseDto, user);
  }

  async verifyCredentials(
    email: string,
    password: string,
  ): Promise<UserResponseDto> {
    this.logger.log('Verify credentials');

    const user = await this.findOneWithSensitiveInfo({ email });

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isMatchPassword = bcrypt.compareSync(password, user.password);

    if (!isMatchPassword) {
      throw new InvalidCredentialsException();
    }

    return plainToInstance(UserResponseDto, user);
  }

  async isValidRecoveryToken(
    userId: number,
    recoveryToken: string,
  ): Promise<boolean> {
    const user = await this.findOneById(userId);
    console.log({ recoveryToken: user.recoveryToken });

    if (user.recoveryToken !== recoveryToken) {
      return false;
    }

    return true;
  }

  async sendWelcomeMail(user: User): Promise<void> {
    const { firstName, lastName, email } = user;
    const welcomeMail = getWelcomeMail(firstName, lastName);

    this.mailerService.sendMail({
      to: email,
      subject: 'Bienvenido a Veterinaria Mitsum',
      html: welcomeMail,
    });
  }
}
