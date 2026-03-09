import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { userExistsConstraint, UserExistsPipe } from './decorators/user.validator';

@Module({
  controllers: [UsersController],
  providers: [UsersService, userExistsConstraint, UserExistsPipe],
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  exports: [UsersService, userExistsConstraint, UserExistsPipe]
})
export class UsersModule { }
