import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/input/create-user.input';
import { UpdateUserDto } from './dto/input/update-user.input';
import { UserResponseDto } from './dto/response/user.response';
import RoleGuard from '../auth/guards/role.guard';
import { Public } from '../auth/decorators/public-route.decorator';
import { FindAllUserArgs } from './dto/args/find-all-user.args';
import { CreatePetDto } from '../pets/dto/input/create-pet.input';
import { PetsService } from '../pets/pets.service';
import { CreateUserWithPetDto } from './dto/input/create-user-with-pet.input';

@Controller({ path: 'users', version: '1' })
@UseGuards(RoleGuard(UserRole.admin, UserRole.client))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => PetsService))
    private readonly petService: PetsService,
  ) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @Get()
  findAll(@Query() args?: FindAllUserArgs): Promise<UserResponseDto[]> {
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
  ): Promise<UserResponseDto> {
    return this.usersService.update(+userId, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete(':userId')
  remove(@Param('userId') userId: string): Promise<UserResponseDto> {
    return this.usersService.remove(+userId);
  }

  @ApiBearerAuth()
  @Post(':userId/pets')
  createPet(
    @Query(':userId') userId: number,
    @Body() createPetDto: CreatePetDto,
  ) {
    return this.petService.create(userId, createPetDto);
  }

  @ApiBearerAuth()
  @Post('pets')
  createUserWithPet(@Body() createUserWithPetDto: CreateUserWithPetDto) {
    return this.usersService.createUserWithPet(createUserWithPetDto);
  }
}
