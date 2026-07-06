import { Controller, Get, Patch, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { type JwtPayload } from 'src/shared/types/jwt-payload.type';

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
