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

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<GenericResponsesDto> {

    const updatedPost = await this.postsRepository.update(id, updatePostDto);

    if (updatedPost) return { message: 'Post correctly updated', statusCode: 200, error: '' }

    throw new BadRequestException('Error updating the post');

  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
