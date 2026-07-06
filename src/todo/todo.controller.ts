import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { type JwtPayload } from 'src/shared/types/jwt-payload.type';

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
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateTodoDto,
  ) {
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
}
