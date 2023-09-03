import { UpdateMedicalHistoryDto } from './dto/input/update-medical-history.input';
import { FindAllPetsArgs } from './dto/args/find-all-pets.args';
import { PrismaService } from './../database/database.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreatePetInput } from './dto/input/create-pet.input';
import { UpdatePetDto } from './dto/input/update-pet.input';
import { TransformStringToDate } from '../shared/utils/transform-date.utils';
import { SpeciesService } from '../species/species.service';
import { UsersService } from '../users/users.service';
import { plainToInstance } from 'class-transformer';
import { PetResponseDto } from './dto/response/pet.response';
import { PetNotFoundException } from './exception/pet-not-found.exception';
import { MedicalHistoryResponseDto } from './dto/response/medical-history.response';
import { Gender, Prisma } from '@prisma/client';
import { getPaginationParams } from '../shared/helper/pagination-params.helper';
import { FindAllPetsResponseDto } from './dto/response/find-all-pets.response';

@Injectable()
export class PetsService {
  private readonly includeRelation = {
    user: true,
    specie: true,
    medicalHistory: {
      include: { food: true, otherPet: true, physicalExam: true },
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly specieService: SpeciesService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async create(userId: number, createPetDto: CreatePetInput) {
    const { birthday, medicalHistory, specieId } = createPetDto;
    const { food, physicalExam, otherPet } = medicalHistory;

    await this.specieService.findOneById(specieId);
    await this.userService.findOneById(userId);

    createPetDto.birthday = TransformStringToDate(birthday as string);

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
        medicalHistory: {
          create: {
            ...medicalHistory,
            food: {
              create: food,
            },
            physicalExam: {
              create: physicalExam,
            },
            otherPet: {
              create: otherPet,
            },
          },
        },
      },
      include: this.includeRelation,
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
      include: {
        ...this.includeRelation,
      },
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
    const pet = this.prisma.pet.findUnique({
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
    const pet = await this.findOneById(id);
    const { medicalHistory } = updatePetDto;

    if (updatePetDto.birthday) {
      updatePetDto.birthday = TransformStringToDate(
        updatePetDto.birthday as string,
      );
    }

    if (medicalHistory) {
      await this.updateMedicalHistory(pet.medicalHistoryId, medicalHistory);
    }

    const updatedPet = await this.prisma.pet.update({
      where: { id },
      data: {
        ...updatePetDto,
        specieId: undefined as never,
        medicalHistory: undefined,
      },
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

  async remove(id: number): Promise<PetResponseDto> {
    await this.findOneById(id);

    const deletedPet = await this.prisma.pet.delete({
      where: { id },
    });

    return plainToInstance(PetResponseDto, deletedPet);
  }
}
