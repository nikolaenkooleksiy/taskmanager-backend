import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../app/project.service';
import { PROJECT_REPOSITORY } from '../domain/types/project.repository.interface';
import { ProjectController } from '../presentation/project.controller';
import { InMemoryProjectRepository } from '../infrastructure/repository/in-memory.project.repository';

describe('ProjectController', () => {
  let controller: ProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        ProjectService,
        {
          provide: PROJECT_REPOSITORY,
          useClass: InMemoryProjectRepository,
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
