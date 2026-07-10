import { type UserRole } from '@prisma/client';

export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: Date;
}
