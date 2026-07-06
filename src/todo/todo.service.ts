import { Inject, Injectable } from '@nestjs/common';
import {
  TODO_REPOSITORY,
  type ITodoRepository,
} from './repository/todo.repository.interface';
import { TodoMapper } from './mapper/todo.mapper';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './model/todo.model';
import { TodoStatus } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(
    @Inject(TODO_REPOSITORY) private readonly todoRepository: ITodoRepository,
  ) {}

  async findAll() {
    const todos = await this.todoRepository.findAll();
    return todos.map((todo) => TodoMapper.toResponse(todo));
  }

  async findById(todoId: string) {
    const todo = await this.todoRepository.findById(todoId);
    return TodoMapper.toResponse(todo);
  }

  async findByUserId(userId: string) {
    const todos = await this.todoRepository.findByUserId(userId);
    return todos.map((todo) => TodoMapper.toResponse(todo));
  }

  async create(dto: CreateTodoDto, userId: string) {
    const todo = new Todo({
      id: crypto.randomUUID(),
      title: dto.title,
      description: dto.description ?? null,
      status: TodoStatus.PENDING,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const created = await this.todoRepository.create(todo);
    return TodoMapper.toResponse(created);
  }

  async update(todoId: string, dto: UpdateTodoDto) {
    const updated = await this.todoRepository.update(todoId, dto);
    return TodoMapper.toResponse(updated);
  }

  async delete(todoId: string) {
    await this.todoRepository.delete(todoId);
  }
}
