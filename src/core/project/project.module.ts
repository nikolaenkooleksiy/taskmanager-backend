import { Module } from '@nestjs/common';
import { LlmModule } from 'src/infrastructure/llm/llm.module';
import { ProjectService } from './app/project.service';
import { TodoService } from './app/todo.service';
import { PROJECT_REPOSITORY } from './domain/types/project.repository.interface';
import { TODO_REPOSITORY } from './domain/types/todo.repository.interface';
import { ProjectRepository } from './infrastructure/repository/project.repository';
import { TodoRepository } from './infrastructure/repository/todo.repository';
import { ProjectController } from './presentation/project.controller';
import { TodoController } from './presentation/todo.controller';

@Module({
  imports: [LlmModule],
  controllers: [TodoController, ProjectController],

  exports: [TODO_REPOSITORY, TodoService],
  providers: [
    ProjectService,
    TodoService,
    {
      provide: TODO_REPOSITORY,
      useClass: TodoRepository,
    },
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectRepository,
    },
  ],
})
export class ProjectModule {}
