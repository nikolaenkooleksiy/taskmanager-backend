import { type AuthProvider, type UserRole } from '@prisma/client';

export class User {
  id!: string;
  username!: string;
  avatarUrl!: string | null;
  email!: string;
  role!: UserRole;
  provider!: AuthProvider;
  providerId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
