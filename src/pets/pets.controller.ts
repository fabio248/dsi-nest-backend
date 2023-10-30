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
import { PetsService } from './pets.service';
import { UpdatePetDto, UpdateMedicalHistoryDto } from './dto/input';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllPetsArgs } from './dto/args/find-all-pets.args';
import RoleGuard from '../auth/guards/role.guard';
import { UserRole } from '../users/dto/enum/role.enum';
import {
  CreateMedicalHistoryInput,
  CreateSurgicalInterventionInput,
  CreateTreatmentInput,
  UpdateSurgicalInterventionDto,
  UpdateTreatmentDto,
} from './dto/input';
import {
  MedicalHistoryResponseDto,
  SurgicalInterventionResponseDto,
  TreatmentResponseDto,
} from './dto/response';
import { UpdateDiagnosticDto } from './dto/input/update-diagnostic.input';

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

  @Post(':petId/medical-histories')
  @ApiBearerAuth()
  createMedicalHistory(
    @Param('petId') petId: number,
    @Body() createMedicalHistoryDto: CreateMedicalHistoryInput,
  ) {
    return this.petsService.createMedicalHistory(
      petId,
      createMedicalHistoryDto,
    );
  }

  @Patch('/medical-histories/:medicalHistoryId/diagnostics')
  @ApiBearerAuth()
  updateDiagnostic(
    @Param('medicalHistoryId') medicalHistoryId: number,
    @Body() updateDiagnosticDto: UpdateDiagnosticDto,
  ) {
    return this.petsService.updateDiagnostic(
      medicalHistoryId,
      updateDiagnosticDto,
    );
  }

  @Post('/medical-histories/diagnostics/:diagnosticId/treatments')
  @ApiBearerAuth()
  createTreatment(
    @Param('diagnosticId') diagnosticId: number,
    @Body() createTreatmentInput: CreateTreatmentInput,
  ) {
    return this.petsService.createTreatment(diagnosticId, createTreatmentInput);
  }

  @Post('/medical-histories/diagnostics/:diagnosticId/surgical-interventions')
  @ApiBearerAuth()
  createSurgicalIntervention(
    @Param('diagnosticId') diagnosticId: number,
    @Body() createSurgicalInterventionDto: CreateSurgicalInterventionInput,
  ) {
    return this.petsService.createSurgicalIntervention(
      diagnosticId,
      createSurgicalInterventionDto,
    );
  }

  @Delete('/medical-histories/diagnostics/treatments/:treatmentId')
  @ApiBearerAuth()
  deleteTreatment(@Param('treatmentId') treatmentId: number) {
    return this.petsService.deleteTreatment(treatmentId);
  }

  @Delete(
    '/medical-histories/diagnostics/surgical-interventions/:surgicalInterventionId',
  )
  @ApiBearerAuth()
  deleteSurgicalIntervention(
    @Param('surgicalInterventionId') surgicalInterventionId: number,
  ) {
    return this.petsService.deleteSurgicalIntervention(surgicalInterventionId);
  }

  @Get('/medical-histories/:medicalHistoryId')
  @ApiBearerAuth()
  findOneMedicalHistory(
    @Param('medicalHistoryId') medicalHistoryId: number,
  ): Promise<MedicalHistoryResponseDto> {
    return this.petsService.findOneMedicalHistoryById(medicalHistoryId);
  }

  @Get('/:petId/medical-histories')
  @ApiBearerAuth()
  async findAllMedicalHistories(@Param('petId') petId: number) {
    return this.petsService.findAllMedicalHistoriesByPet(petId);
  }
}
