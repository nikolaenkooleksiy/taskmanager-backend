import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { type JwtPayload } from 'src/common/types';
import { ProjectService } from '../app/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':teamId')
  async findAll(
    @Param('teamId') teamId: string,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.projectService.findAll(teamId, payload.sub);
  }

  @Get(':id/info')
  async findById(@Param('id') id: string, @CurrentUser() payload: JwtPayload) {
    return this.projectService.findById(id, payload.sub);
  }

  @Post()
  async create(
    @Body() body: CreateProjectDto,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.projectService.create(body, payload.sub);
  }

  @Patch(':id')
  async update(
    @Param('id') projectId: string,
    @Body() body: UpdateProjectDto,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.projectService.update(projectId, body, payload.sub);
  }

  @Post(':id/upload-url')
  async getUploadUrl(
    @Param('id') projectId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: { fileName: string; contentType: string },
  ) {
    return this.projectService.generateProjectImageUrl(
      projectId,
      dto.fileName,
      dto.contentType,
    );
  }

  @Post(':id/confirm')
  async confirmUpload(
    @Param('id') projectId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: { key: string },
  ) {
    return await this.projectService.confirmProjectImageUpload(
      user.sub,
      projectId,
      dto.key,
    );
  }

  @Delete(':id')
  async delete(
    @Param('id') projectId: string,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.projectService.delete(projectId, payload.sub);
  }
}
