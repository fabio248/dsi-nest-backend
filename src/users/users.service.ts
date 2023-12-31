import { ConflictException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { Prisma, User, UserRole } from '@prisma/client';
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
import { GenericArgs } from '../shared/args/generic.args';
import { FindAllUsersResponseDto } from './dto/response/find-all-users.response';
import { getPaginationParams } from '../shared/helper/pagination-params.helper';
import { RequestDocumentInput } from './dto/input/request-document.input';
import { JwtPayload } from '../auth/interfaces/jwt.interface';
import { PetNotFoundException } from '../pets/exception';
import { getRequestDocumentMail } from './utils/mails/request-document.mail';
import { DocumentName } from './dto/enum/document-name';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserInput): Promise<UserResponseDto> {
    this.logger.log('Create a user');

    const { birthday, email } = createUserDto;

    await this.throwErrorIfEmailIsAlreadyTaken(email);

    createUserDto.birthday = TransformStringToDate(birthday as string);

    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    await this.sendWelcomeMail(user);

    return plainToInstance(UserResponseDto, user);
  }

  async createUserWithPet(
    createUserWithPetDto: CreateUserWithPetInput,
  ): Promise<UserWithPetResponseDto> {
    //@ts-ignore
    const createUserDto = { ...createUserWithPetDto, pet: undefined };
    const { pet, email } = createUserWithPetDto;

    await this.throwErrorIfEmailIsAlreadyTaken(email);

    pet.birthday = TransformStringToDate(pet.birthday as string);

    createUserDto.birthday = TransformStringToDate(
      createUserDto.birthday as string,
    );

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        pets: {
          create: pet,
        },
      },
      include: {
        pets: {
          include: {
            specie: true,
          },
        },
      },
    });

    await this.sendWelcomeMail(user);

    return plainToInstance(UserWithPetResponseDto, user);
  }

  async throwErrorIfEmailIsAlreadyTaken(email: string): Promise<void> {
    const isEmailAlreadyTaken = await this.prisma.user.findUnique({
      where: { email },
    });

    if (isEmailAlreadyTaken) {
      throw new EmailAlreadyTakenException(email);
    }
  }

  async findAll(args: FindAllUserArgs): Promise<FindAllUsersResponseDto> {
    this.logger.log('Retrieve all users');
    const { page, limit, search } = args;
    const where: Prisma.UserWhereInput = {};
    let searchRole;

    if (search) {
      searchRole = this.searchInRoleField(search);

      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { direction: { contains: search, mode: 'insensitive' } },
        { dui: { contains: search, mode: 'insensitive' } },
        { role: searchRole },
      ];
    }

    const [totalItems, data] = await Promise.all([
      this.prisma.user.count({
        where,
      }),
      this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
      }),
    ]);
    const paginationParams = getPaginationParams(totalItems, page, limit);

    return plainToInstance(FindAllUsersResponseDto, {
      data,
      ...paginationParams,
    });
  }

  searchInRoleField(search: string): UserRole | undefined {
    let searchRole: UserRole;

    const possibleValuesRoleAdmin = ['administrador', 'admin'];

    if (possibleValuesRoleAdmin.includes(search.toLowerCase())) {
      searchRole = UserRole.admin;
    }

    const possibleValuesRoleClient = ['client', 'cliente'];

    if (possibleValuesRoleClient.includes(search.toLowerCase())) {
      searchRole = UserRole.client;
    }

    return searchRole;
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

  async findOneWithPet(userId: number, args?: GenericArgs) {
    const { skip, take } = args;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        pets: {
          skip,
          take,
          include: {
            medicalHistories: {
              include: {
                food: true,
                otherPet: true,
                physicalExam: true,
                files: true,
              },
            },
            specie: true,
          },
        },
      },
    });

    return plainToInstance(UserWithPetResponseDto, user);
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

    if (updateUserDto.email) {
      await this.throwErrorIfEmailIsAlreadyTaken(updateUserDto.email);
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

    //delete user's appointmets
    const deleteAppointments = this.prisma.appointment.deleteMany({
      where: { clientId: id },
    });

    const deletePets = this.prisma.pet.deleteMany({ where: { userId: id } });

    const deletedUser = this.prisma.user.delete({ where: { id } });

    await this.prisma.$transaction([
      deleteAppointments,
      deletePets,
      deletedUser,
    ]);

    return user;
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

    return user.recoveryToken === recoveryToken;
  }

  async sendWelcomeMail(user: User): Promise<void> {
    const { firstName, lastName, email } = user;
    const welcomeMail = getWelcomeMail(firstName, lastName);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Bienvenido a Veterinaria Mitsum',
      html: welcomeMail,
    });
  }

  async requestDocument(
    user: JwtPayload,
    petId: number,
    { typeDocument }: RequestDocumentInput,
  ): Promise<void> {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      include: { user: true },
    });

    if (!pet) {
      throw new PetNotFoundException(petId);
    }

    if (pet.userId !== user.identify) {
      throw new ConflictException('Pet does not belong to user');
    }

    const mailBody = getRequestDocumentMail(
      pet.user.firstName,
      pet.user.lastName,
      pet.user.email,
      DocumentName[typeDocument],
      pet.name,
    );

    await this.mailerService.sendMail({
      to: this.configService.get('emailsRequestDocument'),
      subject: 'Solicitud de Documento',
      html: mailBody,
    });
  }
}
