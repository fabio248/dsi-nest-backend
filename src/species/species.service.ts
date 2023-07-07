import { Injectable } from '@nestjs/common';
import { CreateSpeciesInput, UpdateSpeciesInput } from './dto/input';
import { plainToInstance } from 'class-transformer';
import { SpecieResponseDto } from './dto/response/specie.response';
import {
  SpecieAlreadyExitsException,
  SpecieNotFoundException,
} from './exception';
import { PrismaService } from '../database/database.service';
import { Specie } from '@prisma/client';

@Injectable()
export class SpeciesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createSpeciesDto: CreateSpeciesInput,
  ): Promise<SpecieResponseDto> {
    const { name } = createSpeciesDto;

    const specie = await this.findOneByName(name);

    if (specie) {
      throw new SpecieAlreadyExitsException(name);
    }

    const newSpecie = await this.prismaService.specie.create({
      data: createSpeciesDto,
    });

    return plainToInstance(SpecieResponseDto, newSpecie);
  }

  async findAll(): Promise<SpecieResponseDto[]> {
    const listSpecie = await this.prismaService.specie.findMany();

    return listSpecie.map((specie) =>
      plainToInstance(SpecieResponseDto, specie),
    );
  }

  async findOneById(id: number): Promise<SpecieResponseDto> {
    const specie = await this.prismaService.specie.findUnique({
      where: { id },
    });

    if (!specie) {
      throw new SpecieNotFoundException(id);
    }

    return plainToInstance(SpecieResponseDto, specie);
  }

  async findOneByName(name: string): Promise<SpecieResponseDto | null> {
    const specie = await this.prismaService.specie.findUnique({
      where: { name },
    });

    if (!specie) {
      return null;
    }

    return plainToInstance(SpecieResponseDto, specie);
  }

  async findOne(id: number): Promise<Specie> {
    const specie = await this.prismaService.specie.findUnique({
      where: { id },
    });

    if (!specie) {
      throw new SpecieNotFoundException(id);
    }

    return specie;
  }

  async update(
    id: number,
    updateSpeciesDto: UpdateSpeciesInput,
  ): Promise<SpecieResponseDto> {
    await this.findOneById(id);

    const updatedSpecie = await this.prismaService.specie.update({
      where: { id },
      data: updateSpeciesDto,
    });

    return plainToInstance(SpecieResponseDto, updatedSpecie);
  }

  async remove(id: number): Promise<SpecieResponseDto> {
    const specie = await this.findOneById(id);

    this.prismaService.specie.delete({ where: { id } });

    return plainToInstance(SpecieResponseDto, specie);
  }
}
