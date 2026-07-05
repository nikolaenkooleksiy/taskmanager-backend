import { type JwtPayload } from './shared/types/jwt-payload.type';
import { CreateUserDto } from './user/dto/create-user.dto';

declare module 'express' {
  export interface Request {
    user?: JwtPayload & CreateUserDto;
    cookies: {
      accessToken?: string;
      refreshToken?: string;
    };
  }
}
