import { Prisma, Todo as PrismaTodo } from '@prisma/client';
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

  static toModel(todo: PrismaTodo): Todo {
    return new Todo(todo);
  }

  static toPersistence(todo: Todo): Prisma.TodoCreateInput {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      project: { connect: { id: todo.projectId } },
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      assignee: { connect: { id: todo.userId } },
    };
  }
}
