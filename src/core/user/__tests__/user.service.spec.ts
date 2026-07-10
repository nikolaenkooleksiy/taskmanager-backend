import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { InMemoryUserRepository } from '../repository/in-memory.user.repository';
import { USER_REPOSITORY } from '../repository/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';

const mockDto: CreateUserDto = {
  username: 'testuser',
  email: 'test@example.com',
  avatarUrl: 'https://example.com/avatar.jpg',
  providerId: '',
  provider: 'LOCAL',
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY,
          useClass: InMemoryUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create user and return response', async () => {
      const user = await service.upsert(mockDto);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.username).toBe(mockDto.username);
      expect(user.email).toBe(mockDto.email);
      expect(user.role).toBe('USER');
    });

    it('should set default values', async () => {
      const user = await service.upsert(mockDto);

      expect(user.role).toBe('USER');
      expect(user.avatarUrl).toBe(mockDto.avatarUrl);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const created = await service.upsert(mockDto);
      const found = await service.findById(created.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.username).toBe(mockDto.username);
    });

    it('should throw when user not found', async () => {
      await expect(service.findById('non-existent-id')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('findByUsername', () => {
    it('should return user by username', async () => {
      await service.upsert(mockDto);
      const found = await service.findByUsername(mockDto.username);

      expect(found).toBeDefined();
      expect(found.username).toBe(mockDto.username);
    });

    it('should throw when user not found', async () => {
      await expect(service.findByUsername('nonexistent')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      await service.upsert(mockDto);
      const found = await service.findByEmail(mockDto.email);

      expect(found).toBeDefined();
      expect(found.email).toBe(mockDto.email);
    });

    it('should throw when user not found', async () => {
      await expect(
        service.findByEmail('nonexistent@example.com'),
      ).rejects.toThrow('User not found');
    });
  });

  describe('update', () => {
    it('should update user fields', async () => {
      const created = await service.upsert(mockDto);
      const updated = await service.update(created.id, {
        username: 'newname',
      });

      expect(updated.username).toBe('newname');

      const found = await service.findById(created.id);
      expect(found.username).toBe('newname');
    });

    it('should throw when user not found', async () => {
      await expect(
        service.update('non-existent-id', { username: 'newname' }),
      ).rejects.toThrow('User not found');
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      const created = await service.upsert(mockDto);
      await service.delete(created.id);

      const users = await service.findAll();
      expect(users).toEqual([]);
    });

    it('should throw when user not found', async () => {
      await expect(service.delete('non-existent-id')).rejects.toThrow(
        'User not found',
      );
    });
  });
});
