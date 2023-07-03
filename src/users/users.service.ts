import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/input';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponse } from './dto/response/user.response';
import { UserNotFoundException } from './exception';
import { TransformStringToDate } from '../shared/utils/transform-date';
import { EmailAlreadyTakenException } from './exception/email-already-taken.exception';

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

    const isEmailAlreadyTaken = await this.userRepository.findBy({
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

  async findAll() {
    this.logger.log('Retrieve all users');

    const listUser = await this.userRepository.find();

    return listUser.map((user) => plainToInstance(UserResponse, user));
  }

  async findOneById(id: number): Promise<UserResponse> {
    this.logger.log('Retrieve one user');

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UserNotFoundException(id);
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
      throw new UserNotFoundException(id);
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
    const user = await this.findOneById(id);

    this.userRepository.delete({ id });

    return plainToInstance(UserResponse, user);
  }
}
