import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/model/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/entities/user.entity';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../model/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<InsertResult> {
    const user = await this.findOneByEmail(createUserDto.email);

    if (user) throw new ConflictException('User already exists');

    return await this.userRepository.insert({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async findOneById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.userRepository.find();
  }

  async updateOne(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.userRepository.update(id, updateUserDto);
  }
}
