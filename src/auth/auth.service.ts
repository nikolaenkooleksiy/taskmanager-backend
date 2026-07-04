import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateToken(userId: string, role: UserRole) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, role },
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: '31d',
      },
    );

    return { accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private validaterefreshToken(token: string, tokenHash: string): boolean {
    const hashedToken = this.hashToken(token);

    return hashedToken === tokenHash;
  }
}
