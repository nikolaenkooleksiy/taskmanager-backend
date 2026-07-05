import { UserRole, AuthProvider } from '@prisma/client';

export class User {
  id: string;
  username: string;
  avatarUrl: string | null;
  email: string;
  password: string | null;
  role: UserRole;
  provider: AuthProvider;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  changePassword(newPassword: string): void {
    this.password = newPassword;
  }

  changeRole(newRole: UserRole): void {
    this.role = newRole;
  }
}
