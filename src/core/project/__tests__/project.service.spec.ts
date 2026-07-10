import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../app/project.service';
import { PROJECT_REPOSITORY } from '../domain/types/project.repository.interface';
import { CreateProjectDto } from '../dto/create-project.dto';
import { InMemoryProjectRepository } from '../infrastructure/repository/in-memory.project.repository';

const mockDto: CreateProjectDto = {
  name: 'Test Project',
  description: 'Test description',
};

const mockUserId = 'user-123';
const otherUserId = 'user-456';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PROJECT_REPOSITORY,
          useClass: InMemoryProjectRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create project and return response', async () => {
      const project = await service.create(mockDto, mockUserId);

      expect(project).toBeDefined();
      expect(project.id).toBeDefined();
      expect(project.name).toBe(mockDto.name);
      expect(project.description).toBe(mockDto.description);
      expect(project.userId).toBe(mockUserId);
    });

    it('should default description to null', async () => {
      const dto: CreateProjectDto = { name: 'No description' };
      const project = await service.create(dto, mockUserId);

      expect(project.description).toBeNull();
    });

    it('should default imageUrl to null', async () => {
      const dto: CreateProjectDto = { name: 'No image' };
      const project = await service.create(dto, mockUserId);

      expect(project.imageUrl).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all projects for user', async () => {
      await service.create(mockDto, mockUserId);
      await service.create({ name: 'Second' }, mockUserId);

      const projects = await service.findAll(mockUserId);
      expect(projects).toHaveLength(2);
    });

    it('should filter by userId', async () => {
      await service.create(mockDto, mockUserId);
      await service.create({ name: 'Other' }, otherUserId);

      const projects = await service.findAll(mockUserId);
      expect(projects).toHaveLength(1);
    });

    it('should return empty array when no projects', async () => {
      const projects = await service.findAll(mockUserId);
      expect(projects).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return project by id', async () => {
      const created = await service.create(mockDto, mockUserId);
      const found = await service.findById(created.id, mockUserId);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.name).toBe(mockDto.name);
    });

    it('should throw when project not found', async () => {
      await expect(
        service.findById('non-existent-id', mockUserId),
      ).rejects.toThrow('Project not found');
    });

    it('should throw when user is not owner', async () => {
      const created = await service.create(mockDto, mockUserId);

      await expect(service.findById(created.id, otherUserId)).rejects.toThrow(
        'Project not found',
      );
    });
  });

  describe('update', () => {
    it('should update project fields', async () => {
      const created = await service.create(mockDto, mockUserId);
      const updated = await service.update(
        created.id,
        { name: 'Updated Name', description: 'Updated description' },
        mockUserId,
      );

      expect(updated.name).toBe('Updated Name');
      expect(updated.description).toBe('Updated description');

      const found = await service.findById(created.id, mockUserId);
      expect(found.name).toBe('Updated Name');
      expect(found.description).toBe('Updated description');
    });

    it('should throw when project not found', async () => {
      await expect(
        service.update('non-existent-id', { name: 'New' }, mockUserId),
      ).rejects.toThrow('Project not found');
    });

    it('should throw when user is not owner', async () => {
      const created = await service.create(mockDto, mockUserId);

      await expect(
        service.update(created.id, { name: 'Hacked' }, otherUserId),
      ).rejects.toThrow('Project not found');
    });
  });

  describe('delete', () => {
    it('should delete project', async () => {
      const created = await service.create(mockDto, mockUserId);
      await service.delete(created.id, mockUserId);

      const projects = await service.findAll(mockUserId);
      expect(projects).toEqual([]);
    });

    it('should throw when project not found', async () => {
      await expect(
        service.delete('non-existent-id', mockUserId),
      ).rejects.toThrow('Project not found');
    });

    it('should throw when user is not owner', async () => {
      const created = await service.create(mockDto, mockUserId);

      await expect(service.delete(created.id, otherUserId)).rejects.toThrow(
        'Project not found',
      );
    });
  });
});
