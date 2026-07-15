import { Inject, Injectable } from '@nestjs/common';
import { GenerateDescriptionDto } from 'src/infrastructure/llm/dto/generate-description.dto';
import { LlmService } from 'src/infrastructure/llm/llm.service';
import { Todo } from '../domain/model/todo.model';
import {
  type ITodoRepository,
  TODO_REPOSITORY,
} from '../domain/types/todo.repository.interface';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { TodoMapper } from '../infrastructure/mapper/todo.mapper';

@Injectable()
export class TodoService {
  constructor(
    @Inject(TODO_REPOSITORY) private readonly todoRepository: ITodoRepository,
    private readonly llmService: LlmService,
  ) {}

  async findAll() {
    const todos = await this.todoRepository.findAll();
    return todos.map((todo) => TodoMapper.toResponse(todo));
  }

  async findById(todoId: string) {
    const todo = await this.todoRepository.findById(todoId);
    return TodoMapper.toResponse(todo);
  }

  async create(dto: CreateTodoDto, userId: string) {
    const todo = Todo.create({
      ...dto,
      assigneeId: userId,
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

  async *generateDescriptionStream(
    todoId: string,
    dto: GenerateDescriptionDto,
  ): AsyncGenerator<string> {
    let fullDescription = '';

    for await (const chunk of this.llmService.generateDescriptionStream(dto)) {
      fullDescription += chunk;
      yield chunk;
    }

    await this.todoRepository.update(todoId, {
      title: dto.title,
      description: fullDescription,
    });
  }
}
