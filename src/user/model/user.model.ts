import { UserRole, AuthProvider } from '@prisma/client';
import { Todo } from 'src/todo/model/todo.model';

export class User {
  id: string;
  username: string;
  avatarUrl: string | null;
  email: string;
  password: string | null;
  role: UserRole;
  provider: AuthProvider;
  providerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  todos: Todo[];

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
