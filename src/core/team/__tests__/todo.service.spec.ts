import { Test, TestingModule } from '@nestjs/testing';
import { TodoStatus } from '@prisma/client';
import { LlmService } from 'src/infrastructure/llm/llm.service';
import { TodoService } from '../app/todo.service';
import { TODO_REPOSITORY } from '../domain/types/todo.repository.interface';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { InMemoryTodoRepository } from '../infrastructure/repository/in-memory.todo.repository';

const mockDto: CreateTodoDto = {
  title: 'Test Todo',
  description: 'Test description',
  projectId: 'project-123',
};

const mockUserId = 'user-123';

const mockLlmService = {
  generateDescription: jest
    .fn()
    .mockResolvedValue({ title: '', description: '' }),
  generateDescriptionStream: jest.fn(),
};

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create todo and return response', async () => {
      const todo = await service.create(mockDto, mockUserId);

      expect(todo).toBeDefined();
      expect(todo.id).toBeDefined();
      expect(todo.title).toBe(mockDto.title);
      expect(todo.description).toBe(mockDto.description);
      expect(todo.status).toBe(TodoStatus.Pending);
    });

    it('should default status to PENDING', async () => {
      const dto: CreateTodoDto = {
        title: 'No status',
        projectId: 'project-123',
      };
      const todo = await service.create(dto, mockUserId);

      expect(todo.status).toBe(TodoStatus.Pending);
    });

    it('should default description to null', async () => {
      const dto: CreateTodoDto = {
        title: 'No description',
        projectId: 'project-123',
      };
      const todo = await service.create(dto, mockUserId);

      expect(todo.description).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      await service.create(mockDto, mockUserId);
      await service.create(
        { title: 'Second', projectId: 'project-123' },
        mockUserId,
      );

      const todos = await service.findAll();
      expect(todos).toHaveLength(2);
    });

    it('should return empty array when no todos', async () => {
      const todos = await service.findAll();
      expect(todos).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return todo by id', async () => {
      const created = await service.create(mockDto, mockUserId);
      const found = await service.findById(created.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.title).toBe(mockDto.title);
    });

    it('should throw when todo not found', async () => {
      await expect(service.findById('non-existent-id')).rejects.toThrow(
        'Todo not found',
      );
    });
  });

  describe('update', () => {
    it('should update todo fields', async () => {
      const created = await service.create(mockDto, mockUserId);
      const updated = await service.update(created.id, {
        title: 'Updated Title',
        status: TodoStatus.Completed,
      });

      expect(updated.title).toBe('Updated Title');
      expect(updated.status).toBe(TodoStatus.Completed);

      const found = await service.findById(created.id);
      expect(found.title).toBe('Updated Title');
      expect(found.status).toBe(TodoStatus.Completed);
    });

    it('should throw when todo not found', async () => {
      await expect(
        service.update('non-existent-id', { title: 'New' }),
      ).rejects.toThrow('Todo not found');
    });
  });

  describe('delete', () => {
    it('should delete todo', async () => {
      const created = await service.create(mockDto, mockUserId);
      await service.delete(created.id);

      const todos = await service.findAll();
      expect(todos).toEqual([]);
    });

    it('should throw when todo not found', async () => {
      await expect(service.delete('non-existent-id')).rejects.toThrow(
        'Todo not found',
      );
    });
  });
});
