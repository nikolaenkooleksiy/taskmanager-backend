jest.mock('ai', () => ({
  createTextStreamResponse: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { LlmService } from 'src/infrastructure/llm/llm.service';
import { TodoService } from '../app/todo.service';
import { TODO_REPOSITORY } from '../domain/types/todo.repository.interface';
import { InMemoryTodoRepository } from '../infrastructure/repository/in-memory.todo.repository';
import { TodoController } from '../presentation/todo.controller';

const mockLlmService = {
  generateDescription: jest
    .fn()
    .mockResolvedValue({ title: '', description: '' }),
  generateDescriptionStream: jest.fn(),
};

describe('TodoController', () => {
  let controller: TodoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        TodoService,
        {
          provide: TODO_REPOSITORY,
          useClass: InMemoryTodoRepository,
        },
        {
          provide: LlmService,
          useValue: mockLlmService,
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
