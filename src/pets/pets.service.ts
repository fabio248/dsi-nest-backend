import {
  UpdateMedicalHistoryDto,
  CreatePetInput,
  UpdatePetDto,
  UpdateTreatmentDto,
  UpdateSurgicalInterventionDto,
  CreateMedicalHistoryInput,
} from './dto/input';
import { FindAllPetsArgs } from './dto/args/find-all-pets.args';
import { PrismaService } from '../database/database.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { TransformStringToDate } from '../shared/utils/transform-date.utils';
import { SpeciesService } from '../species/species.service';
import { UsersService } from '../users/users.service';
import { plainToInstance } from 'class-transformer';
import {
  PetResponseDto,
  TreatmentResponseDto,
  FindAllPetsResponseDto,
  MedicalHistoryResponseDto,
  SurgicalInterventionResponseDto,
  DiagnosticResponseDto,
} from './dto/response';
import {
  MedicalHistoryNotFoundException,
  PetNotFoundException,
  SurgicalInterventionNotFoundException,
  TreatmentNotFoundException,
} from './exception';
import { Gender, Prisma } from '@prisma/client';
import { getPaginationParams } from '../shared/helper/pagination-params.helper';
import { UpdateDiagnosticDto } from './dto/input/update-diagnostic.input';
import { DiagnosticNotFoundException } from './exception/diagnostic-not-found.exception';

@Injectable()
export class PetsService {
  private readonly includeRelation: Prisma.PetInclude = {
    user: true,
    specie: true,
    medicalHistories: {
      include: {
        food: true,
        otherPet: true,
        physicalExam: true,
        diagnostic: {
          include: { treatments: true, surgicalIntervations: true },
        },
      },
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly specieService: SpeciesService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async create(
    userId: number,
    createPetDto: CreatePetInput,
  ): Promise<PetResponseDto> {
    const { birthday, specieId } = createPetDto;

    await this.specieService.findOneById(specieId);
    await this.userService.findOneById(userId);

    createPetDto.birthday = TransformStringToDate(birthday as string);

    const pet = await this.prisma.pet.create({
      data: {
        ...createPetDto,
        userId,
      },
      include: {
        user: true,
        specie: true,
      },
    });

    return plainToInstance(PetResponseDto, pet);
  }

  async findAll(
    findAllPetsArgs: FindAllPetsArgs,
  ): Promise<FindAllPetsResponseDto> {
    const { page, limit, search } = findAllPetsArgs;
    const where: Prisma.PetWhereInput = {};
    let searchGender;

    if (search) {
      searchGender = this.searchInGenderField(search);

      where.OR = [
        { raza: { contains: search, mode: 'insensitive' } },
        { color: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { specie: { name: { contains: search, mode: 'insensitive' } } },
        { gender: searchGender },
        {
          user: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const data = await this.prisma.pet.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      include: this.includeRelation,
    });

    const totalItem = await this.prisma.pet.count({ where });

    const paginationParams = getPaginationParams(totalItem, page, limit);

    return plainToInstance(FindAllPetsResponseDto, {
      data,
      ...paginationParams,
    });
  }

  searchInGenderField(search: string): Gender | undefined {
    let searchGender: Gender;

    if (Gender.macho.includes(search.toLowerCase())) {
      searchGender = Gender.macho;
    }

    if (Gender.hembra.includes(search.toLowerCase())) {
      searchGender = Gender.hembra;
    }

    return searchGender;
  }

  async findOnePetById(id: number): Promise<PetResponseDto> {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: this.includeRelation,
    });

    if (!pet) {
      throw new PetNotFoundException(id);
    }

    return plainToInstance(PetResponseDto, pet);
  }

  async findOneMedicalHistoryById(medicalHistoryId: number) {
    const medicalHistory = await this.prisma.medicalHistory.findUnique({
      where: { id: medicalHistoryId },
      include: {
        food: true,
        otherPet: true,
        physicalExam: true,
        diagnostic: {
          include: { treatments: true, surgicalIntervations: true },
        },
      },
    });

    if (!medicalHistory) {
      throw new MedicalHistoryNotFoundException(medicalHistoryId);
    }

    return plainToInstance(MedicalHistoryResponseDto, medicalHistory);
  }

  async findOneTreatmentById(
    treatmentId: number,
  ): Promise<TreatmentResponseDto> {
    const treatment = await this.prisma.treatment.findUnique({
      where: { id: treatmentId },
    });

    if (!treatment) {
      throw new TreatmentNotFoundException(treatmentId);
    }

    return plainToInstance(TreatmentResponseDto, treatment);
  }

  async findOneSurgicalInterventionById(
    surgicalInterventionId: number,
  ): Promise<SurgicalInterventionResponseDto> {
    const surgicalIntervention =
      await this.prisma.sugicalIntervention.findUnique({
        where: { id: surgicalInterventionId },
      });

    if (!surgicalIntervention) {
      throw new SurgicalInterventionNotFoundException(surgicalInterventionId);
    }

    return plainToInstance(
      SurgicalInterventionResponseDto,
      surgicalIntervention,
    );
  }

  async update(
    id: number,
    updatePetDto: UpdatePetDto,
  ): Promise<PetResponseDto> {
    await this.findOnePetById(id);

    if (updatePetDto.birthday) {
      updatePetDto.birthday = TransformStringToDate(
        updatePetDto.birthday as string,
      );
    }

    const updatedPet = await this.prisma.pet.update({
      where: { id },
      data: updatePetDto,
      include: { ...this.includeRelation, user: false },
    });

    return plainToInstance(PetResponseDto, updatedPet);
  }

  async updateMedicalHistory(
    medicalHistoryId: number,
    updateMedicalHistoryDto: UpdateMedicalHistoryDto,
  ): Promise<MedicalHistoryResponseDto> {
    const { food, physicalExam, otherPet } = updateMedicalHistoryDto;

    await this.findOneMedicalHistoryById(medicalHistoryId);

    const medicalHistory = await this.prisma.medicalHistory.update({
      where: { id: medicalHistoryId },
      data: {
        ...updateMedicalHistoryDto,
        food: {
          update: food,
        },
        physicalExam: { update: physicalExam },
        otherPet: { update: otherPet },
      },
    });

    return plainToInstance(MedicalHistoryResponseDto, medicalHistory);
  }

  async updateTreatment(
    treatmentId: number,
    updateTreatmentDto: UpdateTreatmentDto,
  ): Promise<TreatmentResponseDto> {
    await this.findOneTreatmentById(treatmentId);

    const treatment = await this.prisma.treatment.update({
      where: { id: treatmentId },
      data: updateTreatmentDto,
    });

    return plainToInstance(TreatmentResponseDto, treatment);
  }

  async updateSurgicalIntervention(
    surgicalInterventionId: number,
    updateSurgicalInterventionDto: UpdateSurgicalInterventionDto,
  ): Promise<SurgicalInterventionResponseDto> {
    await this.findOneSurgicalInterventionById(surgicalInterventionId);

    if (updateSurgicalInterventionDto.intervationDate) {
      updateSurgicalInterventionDto.intervationDate = TransformStringToDate(
        updateSurgicalInterventionDto.intervationDate as string,
      );
    }

    const surgicalIntervention = await this.prisma.sugicalIntervention.update({
      where: { id: surgicalInterventionId },
      data: updateSurgicalInterventionDto,
    });

    return plainToInstance(
      SurgicalInterventionResponseDto,
      surgicalIntervention,
    );
  }

  async remove(id: number): Promise<PetResponseDto> {
    await this.findOnePetById(id);

    const deletedPet = await this.prisma.pet.delete({
      where: { id },
    });

    return plainToInstance(PetResponseDto, deletedPet);
  }

  async createMedicalHistory(
    petId: number,
    medicalHistoryInput: CreateMedicalHistoryInput,
  ): Promise<MedicalHistoryResponseDto> {
    await this.findOnePetById(petId);

    const { food, physicalExam, otherPet, diagnostic } = medicalHistoryInput;
    const { treatments, surgicalIntervations } = diagnostic;

    if (surgicalIntervations?.length > 0) {
      surgicalIntervations.forEach((surgicalIntervention) => {
        surgicalIntervention.intervationDate = TransformStringToDate(
          surgicalIntervention.intervationDate as string,
        );
      });
    }

    const medicalHistory = await this.prisma.medicalHistory.create({
      data: {
        ...medicalHistoryInput,
        pet: {
          connect: {
            id: petId,
          },
        },
        food: { create: food },
        physicalExam: { create: physicalExam },
        otherPet: { create: otherPet },
        diagnostic: {
          create: {
            ...diagnostic,
            treatments: { createMany: { data: treatments } },
            surgicalIntervations: surgicalIntervations
              ? {
                  createMany: { data: surgicalIntervations },
                }
              : (undefined as never),
          },
        },
      },
      include: {
        food: true,
        otherPet: true,
        physicalExam: true,
        diagnostic: {
          include: { treatments: true, surgicalIntervations: true },
        },
      },
    });

    return plainToInstance(MedicalHistoryResponseDto, medicalHistory);
  }

  async updateDiagnostic(
    medicalHistoryId: number,
    updateDiagnosticInput: UpdateDiagnosticDto,
  ): Promise<DiagnosticResponseDto> {
    const { diagnostic } = await this.prisma.medicalHistory.findUnique({
      where: {
        id: medicalHistoryId,
      },
      include: {
        diagnostic: true,
      },
    });

    if (!diagnostic) {
      throw new DiagnosticNotFoundException(medicalHistoryId);
    }

    const updatedDiagnostic = await this.prisma.diagnostic.update({
      where: {
        id: diagnostic.id,
      },
      data: updateDiagnosticInput,
    });

    return plainToInstance(DiagnosticResponseDto, updatedDiagnostic);
  }
}
