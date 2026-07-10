import { Module } from '@nestjs/common';
import { LlmModule } from 'src/infrastructure/llm/llm.module';
import { ProjectService } from './app/project.service';
import { TodoService } from './app/todo.service';
import { TODO_REPOSITORY } from './domain/types/todo.repository.interface';
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
  ],
})
export class ProjectModule {}
