import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { type Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type JwtPayload } from 'src/common/types/jwt-payload.type';
import { GenerateDescriptionDto } from 'src/infrastructure/llm/dto/generate-description.dto';

import { createTextStreamResponse } from 'ai';
import { TodoService } from '../app/todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async findAll() {
    return await this.todoService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.todoService.findById(id);
  }

  @Post()
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateTodoDto) {
    return await this.todoService.create(dto, user.sub);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return await this.todoService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.todoService.delete(id);
  }

  @Post('generate-description/:id')
  @HttpCode(HttpStatus.OK)
  async generateDescription(
    @Param('id') todoId: string,
    @Body() dto: GenerateDescriptionDto,
    @Res() res: Response,
  ) {
    const streamGenerator = this.todoService.generateDescriptionStream(
      todoId,
      dto,
    );

    const stream = new ReadableStream<string>({
      async start(controller) {
        for await (const chunk of streamGenerator) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    const streamResponse = createTextStreamResponse({ stream });

    streamResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (streamResponse.body) {
      const reader = streamResponse.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value));
      }
    }

    res.end();
  }
}
