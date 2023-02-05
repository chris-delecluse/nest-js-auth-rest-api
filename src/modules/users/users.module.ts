import { Module } from '@nestjs/common';
import { UsersService } from 'src/modules/users/service/users.service';
import { UsersController } from 'src/modules/users/controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/model/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
