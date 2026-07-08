import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import type { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/shared/decorators/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,

    @Res({ passthrough: true }) res: Response,
  ) {
    const currentRefreshToken = req.cookies['refreshToken'];

    if (!currentRefreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authService.refresh(currentRefreshToken);

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  }

  @Get('github')
  @Public()
  @UseGuards(AuthGuard('github'))
  async github(): Promise<void> {}

  @Get('github/callback')
  @Public()
  @UseGuards(AuthGuard('github'))
  async githubCallback(
    @Req() req: Request,

    @Res() res: Response,
  ) {
    const dto = req.user;

    if (!dto) throw new UnauthorizedException();

    const tokens = await this.authService.login(dto);

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res.redirect(this.configService.getOrThrow<string>('CORS_ORIGIN'));
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 31,
      path: '/',
    });
  }

  private clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }
}
