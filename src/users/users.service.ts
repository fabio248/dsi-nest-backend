import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from './dto/input';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/response/user.response';
import { UserNotFoundException } from './exception';
import { TransformStringToDate } from '../shared/utils/transform-date.utils';
import { EmailAlreadyTakenException } from './exception/email-already-taken.exception';
import { InvalidCredentialsException } from './exception/invalid-credential.exception';
import { FindAllUserArgs } from './dto/args/find-all-user.arg';
import { PrismaService } from '../database/database.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log('Create a user');

    const { birthday, email } = createUserDto;

    const isEmailAlreadyTaken = await this.prisma.user.findUnique({
      where: { email },
    });

    if (isEmailAlreadyTaken) {
      throw new EmailAlreadyTakenException(email);
    }

    createUserDto.birthday = TransformStringToDate(birthday as string);

    const user = this.prisma.user.create({
      data: createUserDto,
    });

    return plainToInstance(UserResponseDto, user);
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
}
