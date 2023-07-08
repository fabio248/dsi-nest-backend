import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SpeciesService } from './species.service';
import { CreateSpeciesInput, UpdateSpeciesInput } from './dto/input';
import RoleGuard from '../auth/guards/role.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
@ApiTags('Species')
@Controller('species')
@UseGuards(RoleGuard(UserRole.admin))
@ApiBearerAuth()
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  create(@Body() createSpeciesDto: CreateSpeciesInput) {
    return this.speciesService.create(createSpeciesDto);
  }

  @Get()
  findAll() {
    return this.speciesService.findAll();
  }

  @Get(':specieId')
  findOne(@Param('specieId') specieId: string) {
    return this.speciesService.findOneById(+specieId);
  }

  @Patch(':specieId')
  update(
    @Param('specieId') specieId: string,
    @Body() updateSpeciesDto: UpdateSpeciesInput,
  ) {
    return this.speciesService.update(+specieId, updateSpeciesDto);
  }

  @Delete(':specieId')
  remove(@Param('specieId') specieId: string) {
    return this.speciesService.remove(+specieId);
  }
}
