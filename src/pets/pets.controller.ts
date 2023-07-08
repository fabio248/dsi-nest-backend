import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { UpdatePetDto } from './dto/input/update-pet.input';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllPetsArgs } from './dto/args/find-all-pets.args';

@ApiTags('Pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  @ApiBearerAuth()
  findAll(@Query() args: FindAllPetsArgs) {
    return this.petsService.findAll(args);
  }

  @Get(':petId')
  @ApiBearerAuth()
  findOne(@Param('petId') petId: string) {
    return this.petsService.findOneById(+petId);
  }

  @Patch(':petId')
  @ApiBearerAuth()
  update(@Param('petId') petId: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.update(+petId, updatePetDto);
  }

  @Delete(':petId')
  @ApiBearerAuth()
  remove(@Param('petId') petId: string) {
    return this.petsService.remove(+petId);
  }
}
