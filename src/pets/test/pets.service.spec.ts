import { Test, TestingModule } from '@nestjs/testing';
import { PetsService } from '../pets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MockPetRepository,
  createMockPetRepository,
} from '../mocks/pets.repository.mock';
import { Pet } from '../entities/pet.entity';
import { CreatePetInput } from '../dto/input/create-pet.input';

describe('PetsService', () => {
  let service: PetsService;
  let mockPetRepository: MockPetRepository;
  const pet = {} as Pet;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        {
          provide: getRepositoryToken(Pet),
          useFactory: createMockPetRepository,
        },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
    mockPetRepository = module.get<MockPetRepository>(getRepositoryToken(Pet));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new pet', async () => {
    mockPetRepository.save.mockResolvedValueOnce(pet);

    const actual = await service.create(pet as unknown as CreatePetInput);

    expect(actual).toEqual(pet);
    expect(mockPetRepository.save).toHaveBeenCalledTimes(1);
  });
});
