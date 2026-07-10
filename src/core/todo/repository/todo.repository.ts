import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { TodoMapper } from '../mapper/todo.mapper';
import { Todo } from '../model/todo.model';
import { ITodoRepository } from './todo.repository.interface';

@Injectable()
export class TodoRepository implements ITodoRepository {
  constructor(private readonly db: PrismaService) {}

  async findAll(): Promise<Todo[]> {
    const todos = await this.db.todo.findMany();
    return todos.map((todo) => TodoMapper.toModel(todo));
  }

  async findById(todoId: string): Promise<Todo> {
    const todo = await this.db.todo.findUniqueOrThrow({
      where: { id: todoId },
    });
    return TodoMapper.toModel(todo);
  }

  async findByUserId(userId: string): Promise<Todo[]> {
    const todos = await this.db.todo.findMany({
      where: { userId },
    });
    return todos.map((todo) => TodoMapper.toModel(todo));
  }

  async create(todo: Todo): Promise<Todo> {
    const data = TodoMapper.toPersistence(todo);
    const created = await this.db.todo.create({ data });
    return TodoMapper.toModel(created);
  }

  async update(todoId: string, todo: Partial<Todo>): Promise<Todo> {
    const updated = await this.db.todo.update({
      where: { id: todoId },
      data: todo,
    });
    return TodoMapper.toModel(updated);
  }

  async delete(todoId: string): Promise<void> {
    await this.db.todo.delete({ where: { id: todoId } });
  }
}
