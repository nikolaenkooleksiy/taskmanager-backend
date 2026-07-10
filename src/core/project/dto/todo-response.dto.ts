import { TodoStatus } from '@prisma/client';

export class TodoResponseDto {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  createdAt: Date;
}
