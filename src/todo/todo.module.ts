import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TODO_REPOSITORY } from './repository/todo.repository.interface';
import { TodoRepository } from './repository/todo.repository';
import { LlmModule } from 'src/llm/llm.module';

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
