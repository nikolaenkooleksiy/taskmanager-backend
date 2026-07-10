import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { UserService } from 'src/core/user/user.service';

import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { CreateUserDto } from 'src/core/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: CreateUserDto) {
    const user = await this.userService.upsert(dto);

    return this.generateToken(user.id, user.role);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('errors.server.refresh_token_missing');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
      );

      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new NotFoundException('errors.server.user_not_found');
      }

      return this.generateToken(user.id, user.role);
    } catch {
      throw new UnauthorizedException('errors.server.invalid_refresh_token');
    }
  }

  private async generateToken(userId: string, role: UserRole) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, role },
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, role },
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '31d',
      },
    );

    return { accessToken, refreshToken };
  }
}
