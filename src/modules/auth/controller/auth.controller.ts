import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { LocalGuard } from 'src/modules/auth/guard/local.guard';
import { RefreshTokenGuard } from 'src/modules/auth/guard/refresh-token.guard';
import { CreateUserDto } from 'src/modules/users/model/dto/create-user.dto';
import { AccessTokenGuard } from 'src/modules/auth/guard/access-token.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signUp')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @UseGuards(LocalGuard)
  @Post('local/signIn')
  @HttpCode(HttpStatus.OK)
  async signIn(@Request() req) {
    return await this.authService.signIn(req.user);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return await this.authService.logout(req.user.sub);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req) {
    return await this.authService.refreshToken(req.user.sub);
  }
}
