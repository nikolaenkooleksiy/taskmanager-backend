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
import { TeamService } from '../app/team.service';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async findAll(@CurrentUser() payload: JwtPayload) {
    return this.teamService.getAllTeams(payload.sub);
  }

  @Get(':id')
  async findById(
    @Param('id') teamId: string,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.teamService.getTeamById(teamId, payload.sub);
  }

  @Post()
  async create(
    @Body() body: CreateTeamDto,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.teamService.createTeam(payload.sub, body);
  }

  @Patch(':id')
  async update(
    @Param('id') teamId: string,
    @Body() body: UpdateTeamDto,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.teamService.updateTeam(teamId, payload.sub, body);
  }

  @Delete(':id')
  async delete(
    @Param('id') teamId: string,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.teamService.deleteTeam(teamId, payload.sub);
  }

  @Get(':id/stats')
  async getStats(
    @Param('id') teamId: string,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.teamService.getTeamStats(teamId, payload.sub);
  }
}
