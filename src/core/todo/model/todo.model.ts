import { TodoStatus } from '@prisma/client';

export class Todo {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Todo>) {
    Object.assign(this, partial);
  }
}
