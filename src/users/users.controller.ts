import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/input/create-user.input';
import { UpdateUserDto } from './dto/input/update-user.input';
import { UserResponse } from './dto/response/user.response';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @Get()
  findAll(): Promise<UserResponse[]> {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @Get(':userId')
  findOne(@Param('userId') id: string): Promise<UserResponse> {
    return this.usersService.findOneById(+id);
  }

  @ApiBearerAuth()
  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+userId, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.usersService.remove(+userId);
  }
}
