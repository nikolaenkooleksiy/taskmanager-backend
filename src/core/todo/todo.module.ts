import { Module } from '@nestjs/common';
import { LlmModule } from 'src/infrastructure/llm/llm.module';
import { TodoRepository } from './repository/todo.repository';
import { TODO_REPOSITORY } from './repository/todo.repository.interface';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [LlmModule],
  controllers: [TodoController],
  providers: [
    TodoService,
    {
      provide: TODO_REPOSITORY,
      useClass: TodoRepository,
    },
  ],
  exports: [TODO_REPOSITORY, TodoService],
})
export class TodoModule {}
