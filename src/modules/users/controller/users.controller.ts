import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/modules/users/service/users.service';
import { AccessTokenGuard } from 'src/modules/auth/guard/access-token.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
