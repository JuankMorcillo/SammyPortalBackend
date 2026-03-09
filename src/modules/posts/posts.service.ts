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

  async findAll(userName?: string, title?: string, order: 'ASC' | 'DESC' = 'ASC') {

    let query = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.status = :status', { status: 1 });

    if (userName) {
      query = query.andWhere(
        '(user.first_name LIKE :userName OR user.last_name LIKE :userName)',
        { userName: `%${userName}%` }
      );
    }

    if (title) {
      query = query.orWhere('post.title LIKE :title', { title: `%${title}%` });
    }

    if (order) {
      query = query.orderBy('post.created_at', order);
    }

    const posts = await query
      .select([
        'post.id',
        'post.authorUserId',
        'post.title',
        'post.content',
        'post.url_image',
        "DATE_FORMAT(post.created_at, '%m-%d-%Y %H:%i:%s') as created_at",
        'user.first_name',
        'user.last_name',
        'user.avatar'
      ])
      .getRawMany();

    if (posts.length > 0) {
      return posts.map(post => ({
        id: post.post_id,
        authorUserId: post.post_authorUserId,
        title: post.post_title,
        content: post.post_content,
        url_image: post.post_url_image,
        created_at: post.created_at,
        user: {
          first_name: post.user_first_name,
          last_name: post.user_last_name,
          avatar: post.user_avatar
        }
      }));
    }

    throw new BadRequestException('Error fetching the posts');
  }

  async findAllByUserId(id: number, title?: string,) {

    let query = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.authorUserId = :id', { id })
      .orderBy('post.created_at', 'DESC')
    if (title) {
      query = query.andWhere('post.title LIKE :title', { title: `%${title}%` });
    }

    const posts = await query
      .select([
        'post.id',
        'post.authorUserId',
        'post.title',
        'post.content',
        'post.url_image',
        'post.status',
        "DATE_FORMAT(post.created_at, '%m-%d-%Y %H:%i:%s') as created_at",
        'user.first_name',
        'user.last_name',
        'user.avatar'
      ])
      .getRawMany();

    if (posts.length > 0) {
      return posts.map(post => ({
        id: post.post_id,
        authorUserId: post.post_authorUserId,
        title: post.post_title,
        content: post.post_content,
        url_image: post.post_url_image,
        created_at: post.created_at,
        status: post.post_status,
        user: {
          first_name: post.user_first_name,
          last_name: post.user_last_name,
          avatar: post.user_avatar
        }
      }));
    }

    throw new BadRequestException('Error fetching the posts');
  }

  async findOne(id: number) {

    const posts = await this.postsRepository.find({
      where: { authorUserId: id, status: 1 },
      select: ['id', 'authorUserId', 'title', 'content', 'url_image', 'created_at']
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
