import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/input/create-user.input';
import { UpdateUserDto } from './dto/input/update-user.input';
import { UserResponseDto } from './dto/response/user.response';
import { ApiBearerAuth } from '@nestjs/swagger';
import RoleGuard from '../auth/guards/role.guard';
import { Public } from '../auth/decorators/public-route.decorator';
import { FindAllUserArgs } from './dto/args/find-all-user.arg';
import { UserRole } from '@prisma/client';

@Controller({ path: 'users', version: '1' })
@UseGuards(RoleGuard(UserRole.ADMIN, UserRole.CLIENT))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @Get()
  findAll(@Query() args?: FindAllUserArgs) {
    return this.usersService.findAll(args);
  }

  @ApiBearerAuth()
  @Get(':userId')
  findOne(@Param('userId') id: string): Promise<UserResponseDto> {
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
