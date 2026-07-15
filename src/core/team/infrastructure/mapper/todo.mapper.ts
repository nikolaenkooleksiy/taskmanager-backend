import { Todo as PrismaTodo } from '@prisma/client';
import { Todo } from '../../domain/model/todo.model';
import { TodoResponseDto } from '../../dto/todo-response.dto';

export class TodoMapper {
  static toResponse(todo: Todo): TodoResponseDto {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      createdAt: todo.createdAt,
    };
  }

  static toDomain(todo: PrismaTodo): Todo {
    return Todo.restore({ ...todo });
  }

  static toPersistence(todo: Todo) {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      assigneeId: todo.assigneeId,
      projectId: todo.projectId,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    };
  }
}
