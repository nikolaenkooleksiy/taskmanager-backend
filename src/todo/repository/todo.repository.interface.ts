import { Todo } from '../model/todo.model';

export const TODO_REPOSITORY = Symbol('TODO_REPOSITORY');

export interface ITodoRepository {
  findAll(): Promise<Todo[]>;
  findById(todoId: string): Promise<Todo>;
  findByUserId(userId: string): Promise<Todo[]>;
  create(todo: Todo): Promise<Todo>;
  update(todoId: string, todo: Partial<Todo>): Promise<Todo>;
  delete(todoId: string): Promise<void>;
}
