import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

  create(createUserDto: CreateUserDto): Promise<User> {

    const newUser = this.usersRepository.create(createUserDto);

    if (newUser) return this.usersRepository.save(newUser);

    throw new BadRequestException('Error creating the user');

  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (user) return user;

    throw new BadRequestException('User not found');
  }

  async isRegistered(email: string): Promise<User> {

    const user = await this.usersRepository.findOne({ where: { email }, select: ['id'] });

    if (user) return user

    return { id: 0 } as User;

  }
}
