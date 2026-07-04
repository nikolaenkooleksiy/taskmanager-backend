import { type JwtPayload } from './shared/types/jwt-payload.type';

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
    cookies: {
      accessToken?: string;
      refreshToken?: string;
    };
  }
}
