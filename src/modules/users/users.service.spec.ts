// src/modules/users/users.service.simple.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UsersService;

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });


  it('should return if the user is already registered', async () => {

    mockUserRepository.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });

    const resultado = await service.isRegistered('test@example.com');

    expect(resultado.id).toBe(1);
  });

  it('should return { id: 0 } if the user isn´t registered', async () => {

    mockUserRepository.findOne.mockResolvedValue(null);

    const resultado = await service.isRegistered('noexiste@example.com');

    expect(resultado.id).toBe(0);
  });

  it('should call findOne with email correctly', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    await service.isRegistered('prueba@example.com');

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'prueba@example.com' },
      select: ['id'],
    });
  });
});