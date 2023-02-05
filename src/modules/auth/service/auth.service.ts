import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadType } from 'src/modules/auth/model/type/JwtPayload.type';
import { CreateUserDto } from 'src/modules/users/model/dto/create-user.dto';
import * as process from 'process';
import { UsersService } from '../../users/service/users.service';
import { User } from '../../users/model/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  async signIn(user: User) {
    const payload = { sub: user.id, email: user.email };
    const tokens = await this.generateTokens(payload);

    await this.usersService.updateOne(user.id, {
      refreshToken: tokens.refreshToken,
    });

    return { tokens };
  }

  async logout(userId: string) {
    const user = await this.usersService.findOneById(userId);

    return await this.usersService.updateOne(user.id, {
      refreshToken: null,
    });
  }

  async generateTokens(
    payload: JwtPayloadType,
  ): Promise<Record<string, string>> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '60s',
      }),
      this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '120s',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken(userId: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException();

    const payload: JwtPayloadType = { sub: user.id, email: user.email };
    const tokens = await this.generateTokens(payload);

    await this.usersService.updateOne(user.id, {
      refreshToken: tokens.refreshToken,
    });

    return { tokens };
  }
}
