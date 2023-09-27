import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { UpdatePetDto } from './dto/input/update-pet.input';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllPetsArgs } from './dto/args/find-all-pets.args';
import RoleGuard from '../auth/guards/role.guard';
import { UserRole } from '../users/dto/enum/role.enum';
import { UpdateMedicalHistoryDto } from './dto/input/update-medical-history.input';
import { UpdateSurgicalInterventionDto, UpdateTreatmentDto } from './dto/input';
import {
  SurgicalInterventionResponseDto,
  TreatmentResponseDto,
} from './dto/response';

@ApiTags('Pets')
@Controller('pets')
@UseGuards(RoleGuard(UserRole.ADMIN))
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
    return this.petsService.findOnePetById(+petId);
  }

  @Patch(':petId')
  @ApiBearerAuth()
  update(@Param('petId') petId: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.update(+petId, updatePetDto);
  }

  @Patch('/medical-histories/:medicalHistoryId')
  @ApiBearerAuth()
  updateMedicalHistory(
    @Param('medicalHistoryId') medicalHistoryId: number,
    @Body() updateMedicalHistoryDto: UpdateMedicalHistoryDto,
  ) {
    return this.petsService.updateMedicalHistory(
      medicalHistoryId,
      updateMedicalHistoryDto,
    );
  }

  @Patch('/treatments/:treatmentId')
  @ApiBearerAuth()
  updateTreatment(
    @Param('treatmentId') treatmentId: number,
    @Body() updateTreatmentDto: UpdateTreatmentDto,
  ): Promise<TreatmentResponseDto> {
    return this.petsService.updateTreatment(treatmentId, updateTreatmentDto);
  }

  @Patch('/surgical-interventions/:surgicalInterventionId')
  @ApiBearerAuth()
  updateSurgicalIntervention(
    @Param('surgicalInterventionId') surgicalInterventionId: number,
    @Body() updateSurgicalInterventionDto: UpdateSurgicalInterventionDto,
  ): Promise<SurgicalInterventionResponseDto> {
    return this.petsService.updateSurgicalIntervention(
      surgicalInterventionId,
      updateSurgicalInterventionDto,
    );
  }

  @Delete(':petId')
  @ApiBearerAuth()
  remove(@Param('petId') petId: string) {
    return this.petsService.remove(+petId);
  }
}
