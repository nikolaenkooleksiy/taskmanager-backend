import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../app/project.service';
import { PROJECT_REPOSITORY } from '../domain/types/project.repository.interface';
import { CreateProjectDto } from '../dto/create-project.dto';
import { InMemoryProjectRepository } from '../infrastructure/repository/in-memory.project.repository';
import { StorageService } from 'src/infrastructure/storage/storage.service';

const mockDto: CreateProjectDto = {
  name: 'Test Project',
  description: 'Test description',
};

const mockTeamId = 'team-123';
const mockUserId = 'user-123';
const otherTeamId = 'team-456';

const mockStorageService = {
  getUploadUrl: jest.fn(),
  getDownloadUrl: jest.fn(),
  deleteFile: jest.fn(),
};

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    mockStorageService.getUploadUrl.mockReset();
    mockStorageService.getDownloadUrl.mockReset();
    mockStorageService.deleteFile.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PROJECT_REPOSITORY,
          useClass: InMemoryProjectRepository,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
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
      const project = await service.create(mockDto, mockTeamId);

      expect(project).toBeDefined();
      expect(project.id).toBeDefined();
      expect(project.name).toBe(mockDto.name);
      expect(project.description).toBe(mockDto.description);
    });

    it('should default description to null', async () => {
      const dto: CreateProjectDto = { name: 'No description' };
      const project = await service.create(dto, mockTeamId);

      expect(project.description).toBeNull();
    });

    it('should default imageUrl to null', async () => {
      const dto: CreateProjectDto = { name: 'No image' };
      const project = await service.create(dto, mockTeamId);

      expect(project.imageUrl).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all projects for team', async () => {
      await service.create(mockDto, mockTeamId);
      await service.create({ name: 'Second' }, mockTeamId);

      const projects = await service.findAll(mockTeamId, mockUserId);
      expect(projects).toHaveLength(2);
    });

    it('should filter by teamId', async () => {
      await service.create(mockDto, mockTeamId);
      await service.create({ name: 'Other' }, otherTeamId);

      const projects = await service.findAll(mockTeamId, mockUserId);
      expect(projects).toHaveLength(1);
    });

    it('should return empty array when no projects', async () => {
      const projects = await service.findAll(mockTeamId, mockUserId);
      expect(projects).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return project by id', async () => {
      const created = await service.create(mockDto, mockTeamId);
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
  });

  describe('update', () => {
    it('should update project fields', async () => {
      const created = await service.create(mockDto, mockTeamId);
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
  });

  describe('delete', () => {
    it('should delete project', async () => {
      const created = await service.create(mockDto, mockTeamId);
      await service.delete(created.id, mockUserId);

      const projects = await service.findAll(mockTeamId, mockUserId);
      expect(projects).toEqual([]);
    });
  });
});
