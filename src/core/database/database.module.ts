import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'process';
import { User } from 'src/modules/users/model/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      database: process.env.DB_NAME,
      uuidExtension: 'pgcrypto',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
