import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from './dto/input';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponse } from './dto/response/user.response';
import { UserNotFoundException } from './exception';
import { TransformStringToDate } from '../shared/utils/transform-date';
import { EmailAlreadyTakenException } from './exception/email-already-taken.exception';
import { InvalidCredentialsException } from './exception/invalid-credential.exception';
import { FindAllUserArgs } from './dto/args/find-all-user.arg';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    this.logger.log('Create a user');

    const { birthday, email } = createUserDto;

    const isEmailAlreadyTaken = await this.userRepository.findOneBy({
      email,
    });

    if (isEmailAlreadyTaken) {
      throw new EmailAlreadyTakenException(email);
    }

    const transformedDate = TransformStringToDate(birthday as string);

    const user = this.userRepository.save({
      ...createUserDto,
      birthday: transformedDate,
    });

    return plainToInstance(UserResponse, user);
  }

  async findAll(args: FindAllUserArgs) {
    const { skip, take } = args;
    this.logger.log('Retrieve all users');

    const listUser = await this.userRepository.find({ skip, take });

    return listUser.map((user) => plainToInstance(UserResponse, user));
  }

  async findOneById(id: number): Promise<UserResponse> {
    this.logger.log('Retrieve one user');

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UserNotFoundException({ id });
    }

    return plainToInstance(UserResponse, user);
  }

  async findOneByEmail(email: string): Promise<UserResponse> {
    this.logger.log('Retrieve one user');

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UserNotFoundException({ email });
    }

    return plainToInstance(UserResponse, user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    this.logger.log('Update one user');

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UserNotFoundException({ id });
    }

    if (updateUserDto.birthday) {
      updateUserDto.birthday = TransformStringToDate(
        updateUserDto.birthday as string,
      );
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    return plainToInstance(UserResponse, updatedUser);
  }

  async remove(id: number): Promise<UserResponse> {
    this.logger.log('Delete one user');

    const user = await this.findOneById(id);

    this.userRepository.delete({ id });

    return plainToInstance(UserResponse, user);
  }

  async verifyCredentials(
    email: string,
    password: string,
  ): Promise<UserResponse> {
    this.logger.log('Verify credentials');

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isMatchPassword = bcrypt.compareSync(password, user.password);

    if (!isMatchPassword) {
      throw new InvalidCredentialsException();
    }

    return plainToInstance(UserResponse, user);
  }
}
