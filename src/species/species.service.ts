import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpeciesInput, UpdateSpeciesInput } from './dto/input';
import { Specie } from './entities/species.entity';
import { plainToInstance } from 'class-transformer';
import { SpecieResponseDto } from './dto/response/specie.response';
import {
  SpecieAlreadyExitsException,
  SpecieNotFoundException,
} from './exception';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Specie)
    private readonly specieRepository: Repository<Specie>,
  ) {}

  async create(
    createSpeciesDto: CreateSpeciesInput,
  ): Promise<SpecieResponseDto> {
    const { name } = createSpeciesDto;

    const specie = await this.findOneByName(name);

    if (specie) {
      throw new SpecieAlreadyExitsException(name);
    }

    const newSpecie = await this.specieRepository.save(createSpeciesDto);

    return plainToInstance(SpecieResponseDto, newSpecie);
  }

  async findAll(): Promise<SpecieResponseDto[]> {
    const listSpecie = await this.specieRepository.find();

    return listSpecie.map((specie) =>
      plainToInstance(SpecieResponseDto, specie),
    );
  }

  async findOneById(id: number): Promise<SpecieResponseDto> {
    const specie = await this.specieRepository.findOneBy({ id });

    if (!specie) {
      throw new SpecieNotFoundException(id);
    }

    return plainToInstance(SpecieResponseDto, specie);
  }

  async findOneByName(name: string): Promise<SpecieResponseDto | null> {
    const specie = await this.specieRepository.findOneBy({ name });

    if (!specie) {
      return null;
    }

    return plainToInstance(SpecieResponseDto, specie);
  }

  async update(
    id: number,
    updateSpeciesDto: UpdateSpeciesInput,
  ): Promise<SpecieResponseDto> {
    const specie = await this.specieRepository.findOneBy({ id });

    if (!specie) {
      throw new SpecieNotFoundException(id);
    }

    const updatedSpecie = await this.specieRepository.save({
      ...specie,
      ...updateSpeciesDto,
    });

    return plainToInstance(SpecieResponseDto, updatedSpecie);
  }

  async remove(id: number): Promise<SpecieResponseDto> {
    const specie = await this.findOneById(id);

    this.specieRepository.delete({ id });

    return plainToInstance(SpecieResponseDto, specie);
  }
}
