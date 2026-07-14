import { Injectable } from '@nestjs/common';
import { Todo } from '../../domain/model/todo.model';
import { type ITodoRepository } from '../../domain/types/todo.repository.interface';

@Injectable()
export class InMemoryTodoRepository implements ITodoRepository {
  private todos = new Map<string, Todo>();

  findAll(): Promise<Todo[]> {
    return Promise.resolve(Array.from(this.todos.values()));
  }

  findById(todoId: string): Promise<Todo> {
    const todo = this.todos.get(todoId);
    if (!todo) return Promise.reject(new Error('Todo not found'));
    return Promise.resolve(todo);
  }

  findByUserId(userId: string): Promise<Todo[]> {
    const todos = Array.from(this.todos.values()).filter(
      (t) => t.userId === userId,
    );
    return Promise.resolve(todos);
  }

  create(todo: Todo): Promise<Todo> {
    const newTodo = new Todo({ ...todo, id: todo.id || crypto.randomUUID() });
    this.todos.set(newTodo.id, newTodo);
    return Promise.resolve(newTodo);
  }

  update(todoId: string, todo: Partial<Todo>): Promise<Todo> {
    const existing = this.todos.get(todoId);
    if (!existing) return Promise.reject(new Error('Todo not found'));
    const updated = new Todo({ ...existing, ...todo });
    this.todos.set(todoId, updated);
    return Promise.resolve(updated);
  }

  delete(todoId: string): Promise<void> {
    if (!this.todos.has(todoId))
      return Promise.reject(new Error('Todo not found'));
    this.todos.delete(todoId);
    return Promise.resolve();
  }
}
