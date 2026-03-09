import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Create user' })
  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ description: 'The record has been successfully created.', status: 201 })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Check if user is registered' })
  @Get(':email')  
  @ApiResponse({ description: 'The user has been search.', status: 200 })
  findByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.isRegistered(email);
  }

}
