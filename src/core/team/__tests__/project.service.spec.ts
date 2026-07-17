import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from 'src/infrastructure/storage/storage.service';
import { ProjectService } from '../app/project.service';
import { PROJECT_REPOSITORY } from '../domain/types/project.repository.interface';
import { CreateProjectDto } from '../dto/create-project.dto';
import { InMemoryProjectRepository } from '../infrastructure/repository/in-memory.project.repository';

const mockDto: CreateProjectDto = {
  name: 'Test Project',
  description: 'Test description',
  teamId: 'team-123',
  icon: 'default-icon',
};

const mockTeamId = 'team-123';
const mockUserId = 'user-123';

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
      const project = await service.create(mockDto);

      expect(project).toBeDefined();
      expect(project.id).toBeDefined();
      expect(project.name).toBe(mockDto.name);
      expect(project.description).toBe(mockDto.description);
    });

    it('should default description to null', async () => {
      const dto: CreateProjectDto = {
        name: 'No description',
        icon: 'default-icon',
        teamId: 'team-123',
      };
      const project = await service.create(dto);

      expect(project.description).toBeNull();
    });

    it('should default imageUrl to null', async () => {
      const dto: CreateProjectDto = {
        name: 'No image',
        teamId: 'team-123',
        icon: 'default-icon',
      };
      const project = await service.create(dto);

      expect(project.icon).not.toBeFalsy();
    });
  });

  describe('findAll', () => {
    it('should return all projects for team', async () => {
      await service.create(mockDto);
      await service.create({
        name: 'Second',
        teamId: 'team-123',
        icon: 'icon-2',
      });

      const projects = await service.findAll(mockTeamId, mockUserId);
      expect(projects).toHaveLength(2);
    });

    it('should filter by teamId', async () => {
      await service.create(mockDto);
      await service.create({
        name: 'Other',
        teamId: 'team-456',
        icon: 'icon-3',
      });

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
      const created = await service.create(mockDto);
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
      const created = await service.create(mockDto);
      const updated = await service.update(
        created.id,
        {
          name: 'Updated Name',
          description: 'Updated description',
          teamId: 'team-123',
        },
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
        service.update(
          'non-existent-id',
          { name: 'New', teamId: 'team-123' },
          mockUserId,
        ),
      ).rejects.toThrow('Project not found');
    });
  });

  describe('delete', () => {
    it('should delete project', async () => {
      const created = await service.create(mockDto);
      await service.delete(created.id, mockUserId);

      const projects = await service.findAll(mockTeamId, mockUserId);
      expect(projects).toEqual([]);
    });
  });
});
