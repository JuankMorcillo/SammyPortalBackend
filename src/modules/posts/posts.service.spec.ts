import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

describe('PostsService', () => {
  let service: PostsService;

  const mockPostRepository = {
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
      ],

    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post correctly', async () => {
    const createPostDto = {
      authorUserId: 1,
      title: 'Mi primer post',
      content: 'Este es mi primer post',
      url_image: 'https://example.com/image.jpg'
    };

    mockPostRepository.save.mockResolvedValue({
      id: 1,
      ...createPostDto,
      created_at: new Date(),
    });

    const resultado = await service.create(createPostDto);

    expect(resultado.statusCode).toBe(201);
    expect(resultado.message).toContain('correctly created');
  });

});
