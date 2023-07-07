import { FindAllPetsArgs } from './dto/args/find-all-pets.args';
import { PrismaService } from './../database/database.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreatePetDto } from './dto/input/create-pet.input';
import { UpdatePetDto } from './dto/input/update-pet.input';
import { TransformStringToDate } from '../shared/utils/transform-date.utils';
import { SpeciesService } from '../species/species.service';
import { UsersService } from '../users/users.service';
import { plainToInstance } from 'class-transformer';
import { PetResponseDto } from './dto/response/pet.response';
import { PetNotFoundException } from './exception/pet-not-found.exception';

@Injectable()
export class PetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly specieService: SpeciesService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async create(userId: number, createPetDto: CreatePetDto) {
    const { birthday, specieId } = createPetDto;
    await this.specieService.findOneById(specieId);
    await this.userService.findOneById(userId);

    createPetDto.birthday = TransformStringToDate(birthday as string);

    const pet = await this.prisma.pet.create({
      data: { ...createPetDto, userId },
    });

    return plainToInstance(PetResponseDto, pet);
  }

  async findAll(findAllPetsArgs: FindAllPetsArgs): Promise<PetResponseDto[]> {
    const { take, skip, includeUserInfo } = findAllPetsArgs;

    const listPets = await this.prisma.pet.findMany({
      skip,
      take,
      include: { user: includeUserInfo },
    });

    return listPets.map((pet) => plainToInstance(PetResponseDto, pet));
  }

  async findOneById(id: number): Promise<PetResponseDto> {
    const pet = this.prisma.pet.findUnique({ where: { id } });

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

    const updatedPet = await this.prisma.pet.update({
      where: { id },
      data: updatePetDto,
    });

    return plainToInstance(PetResponseDto, updatedPet);
  }

  async remove(id: number): Promise<PetResponseDto> {
    await this.findOneById(id);

    const deletedPet = await this.prisma.pet.delete({
      where: { id },
    });

    return plainToInstance(PetResponseDto, deletedPet);
  }
}
