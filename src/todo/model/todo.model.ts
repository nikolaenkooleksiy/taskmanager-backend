import { TodoStatus } from '@prisma/client';
import { User } from 'src/user/model/user.model';

export class Todo {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
  user: User;

  constructor(partial: Partial<Todo>) {
    Object.assign(this, partial);
  }
}
