import { Test, TestingModule } from '@nestjs/testing';
import { LlmService } from 'src/llm/llm.service';
import { TodoController } from '../../../todo/todo.controller';
import { TodoService } from '../app/todo.service';
import { InMemoryTodoRepository } from '../infrastructure/repository/in-memory.todo.repository';
import { TODO_REPOSITORY } from '../../project/infrastructure/repository/todo.repository.interface';

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
