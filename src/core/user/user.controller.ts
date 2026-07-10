import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { type JwtPayload } from 'src/common/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('me')
  async findById(@CurrentUser() user: JwtPayload) {
    return await this.userService.findById(user.sub);
  }

  @Patch()
  async update(@CurrentUser() user: JwtPayload, @Body() dto: UpdateUserDto) {
    return await this.userService.update(user.sub, dto);
  }

  @Delete()
  async delete(@CurrentUser() user: JwtPayload) {
    return await this.userService.delete(user.sub);
  }
}
