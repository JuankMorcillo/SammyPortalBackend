import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GenericResponsesDto } from 'src/common/dto/generic-response.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @ApiOperation({ summary: 'Create post' })
  @Post()
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ description: 'The record has been successfully created.', status: 201 })
  create(@Body() createPostDto: CreatePostDto): Promise<GenericResponsesDto> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all active posts' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'List posts by author_user_id' })
  findByAuthorUserId(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update post' })
  @Patch(':id')
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ description: 'The record has been successfully updated.', status: 200 })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @ApiOperation({ summary: 'Remove post' })
  @Delete(':id')
  @ApiResponse({ description: 'The record has been successfully removed.', status: 200 })
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
