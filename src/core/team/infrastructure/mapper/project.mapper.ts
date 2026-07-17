import { Project as PrismaProject } from '@prisma/client';
import { Project } from '../../domain/model/project.model';
import { ProjectResponseDto } from '../../dto/project-response.dto';

export class ProjectMapper {
  static toResponse(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      icon: project.icon,
      createdAt: project.createdAt,
    };
  }

  static toDomain(project: PrismaProject): Project {
    return Project.restore({ ...project });
  }

  static toPersistence(project: Project) {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      icon: project.icon,
      teamId: project.teamId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
