import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from '../todo.controller';
import { TodoService } from '../todo.service';
import { TODO_REPOSITORY } from '../repository/todo.repository.interface';
import { InMemoryTodoRepository } from '../repository/in-memory.todo.repository';
import { LlmService } from 'src/llm/llm.service';

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
