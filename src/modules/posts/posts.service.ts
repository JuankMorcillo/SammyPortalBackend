import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GenericResponsesDto } from 'src/common/dto/generic-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>
  ) { }

  async create(createPostDto: CreatePostDto): Promise<GenericResponsesDto> {

    const newPost = await this.postsRepository.save(createPostDto);

    if (newPost) return { message: 'Post correctly created', statusCode: 201, error: '' }

    throw new BadRequestException('Error creating the post');

  }

  async findAll() {

    const posts = await this.postsRepository.find({
      where: { status: 1 },
      select: ['id', 'authorUserId', 'title', 'content', 'created_at']
    });

    if (posts) return posts;

    throw new BadRequestException('Error fetching the posts');
  }

  async findOne(id: number) {

    const posts = await this.postsRepository.find({
      where: { authorUserId: id, status: 1 },
      select: ['id', 'authorUserId', 'title', 'content', 'created_at']
    });

    if (posts) return posts;

    throw new BadRequestException('Error fetching the posts');
    
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<GenericResponsesDto> {

    const updatedPost = await this.postsRepository.update(id, updatePostDto);

    if (updatedPost) return { message: 'Post correctly updated', statusCode: 200, error: '' }

    throw new BadRequestException('Error updating the post');

  }

  async remove(id: number) {
    const removedPost = await this.postsRepository.update(id, { status: 0 });

    if (removedPost) return { message: 'Post correctly removed', statusCode: 200, error: '' }

    throw new BadRequestException('Error removing the post');

  }
}
