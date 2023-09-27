import {
  UpdateMedicalHistoryDto,
  CreatePetInput,
  UpdatePetDto,
  UpdateTreatmentDto,
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
} from './dto/response';
import { PetNotFoundException } from './exception/pet-not-found.exception';
import { Gender, Prisma } from '@prisma/client';
import { getPaginationParams } from '../shared/helper/pagination-params.helper';

@Injectable()
export class PetsService {
  private readonly includeRelation = {
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

  async create(userId: number, createPetDto: CreatePetInput) {
    const { birthday, medicalHistories, specieId } = createPetDto;
    const { food, physicalExam, otherPet, diagnostic } = medicalHistories;
    const { treatments, surgicalInterventions } = diagnostic;

    await this.specieService.findOneById(specieId);
    await this.userService.findOneById(userId);

    createPetDto.birthday = TransformStringToDate(birthday as string);

    if (surgicalInterventions.length > 0) {
      surgicalInterventions.forEach((surgicalIntervention) => {
        surgicalIntervention.intervationDate = TransformStringToDate(
          surgicalIntervention.intervationDate as string,
        );
      });
    }

    const pet = await this.prisma.pet.create({
      data: {
        ...createPetDto,
        specieId: undefined as never,
        specie: {
          connect: {
            id: specieId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        medicalHistories: {
          create: {
            ...medicalHistories,
            food: {
              create: food,
            },
            physicalExam: {
              create: physicalExam,
            },
            otherPet: {
              create: otherPet,
            },
            diagnostic: {
              create: {
                description: diagnostic.description,
                treatments: {
                  createMany: {
                    data: treatments,
                  },
                },
                surgicalIntervations: {
                  createMany: {
                    data: surgicalInterventions,
                  },
                },
              },
            },
          },
        },
      },
      include: {
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
          orderBy: {
            createdAt: 'asc',
          },
        },
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

    const macho = 'macho';
    const hembra = 'hembra';

    if (macho.includes(search.toLowerCase())) {
      searchGender = Gender.macho;
    }

    if (hembra.includes(search.toLowerCase())) {
      searchGender = Gender.hembra;
    }

    return searchGender;
  }

  async findOneById(id: number): Promise<PetResponseDto> {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: this.includeRelation,
    });

    if (!pet) {
      throw new PetNotFoundException(id);
    }

    return plainToInstance(PetResponseDto, pet);
  }

  async update(
    id: number,
    updatePetDto: UpdatePetDto,
  ): Promise<PetResponseDto> {
    await this.findOneById(id);

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
    const treatment = await this.prisma.treatment.update({
      where: { id: treatmentId },
      data: updateTreatmentDto,
    });

    return plainToInstance(TreatmentResponseDto, treatment);
  }

  async remove(id: number): Promise<PetResponseDto> {
    await this.findOneById(id);

    const deletedPet = await this.prisma.pet.delete({
      where: { id },
    });

    return plainToInstance(PetResponseDto, deletedPet);
  }
}
