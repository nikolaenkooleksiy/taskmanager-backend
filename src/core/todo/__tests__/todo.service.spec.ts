import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../todo.service';
import { InMemoryTodoRepository } from '../repository/in-memory.todo.repository';
import { TODO_REPOSITORY } from '../repository/todo.repository.interface';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { TodoStatus } from '@prisma/client';
import { LlmService } from 'src/llm/llm.service';

const mockDto: CreateTodoDto = {
  title: 'Test Todo',
  description: 'Test description',
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
      expect(todo.status).toBe(TodoStatus.PENDING);
    });

    it('should default status to PENDING', async () => {
      const dto: CreateTodoDto = { title: 'No status' };
      const todo = await service.create(dto, mockUserId);

      expect(todo.status).toBe(TodoStatus.PENDING);
    });

    it('should default description to null', async () => {
      const dto: CreateTodoDto = { title: 'No description' };
      const todo = await service.create(dto, mockUserId);

      expect(todo.description).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      await service.create(mockDto, mockUserId);
      await service.create({ title: 'Second' }, mockUserId);

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

  describe('findByUserId', () => {
    it('should return todos for user', async () => {
      await service.create(mockDto, mockUserId);
      await service.create({ title: 'Other' }, 'other-user');

      const todos = await service.findByUserId(mockUserId);
      expect(todos).toHaveLength(1);
    });

    it('should return empty array when user has no todos', async () => {
      const todos = await service.findByUserId('no-user');
      expect(todos).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update todo fields', async () => {
      const created = await service.create(mockDto, mockUserId);
      const updated = await service.update(created.id, {
        title: 'Updated Title',
        status: TodoStatus.COMPLETED,
      });

      expect(updated.title).toBe('Updated Title');
      expect(updated.status).toBe(TodoStatus.COMPLETED);

      const found = await service.findById(created.id);
      expect(found.title).toBe('Updated Title');
      expect(found.status).toBe(TodoStatus.COMPLETED);
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
