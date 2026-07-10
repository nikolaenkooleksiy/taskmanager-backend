import { Prisma, Project as PrismaProject } from '@prisma/client';
import { Project } from '../../domain/model/project.model';
import { ProjectResponseDto } from '../../dto/project-response.dto';

export class ProjectMapper {
  static toResponse(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      imageUrl: project.imageUrl,
      createdAt: project.createdAt,
    };
  }

  static toModel(project: PrismaProject): Project {
    return new Project(project);
  }

  static toPersistence(project: Project): Prisma.ProjectCreateInput {
    return {
      id: project.id,
      name: project.name,
      user: { connect: { id: project.userId } },
      description: project.description,
      imageUrl: project.imageUrl,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
