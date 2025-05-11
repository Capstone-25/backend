import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { MissionService } from '@src/modules/missions/mission.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MissionSwagger } from './swagger/mission.swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Missions')
@Controller('missions')
@UseGuards(JwtAuthGuard)
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get()
  @MissionSwagger.getMyMissions.operation
  @MissionSwagger.getMyMissions.response
  async getMyMissions(@Req() req) {
    return this.missionService.getMyMissions(req.user.userId);
  }

  @Patch(':missionId/progress')
  @MissionSwagger.updateMissionProgress.operation
  @MissionSwagger.updateMissionProgress.param
  @MissionSwagger.updateMissionProgress.response
  async updateMissionProgress(@Param('missionId') missionId: string) {
    return this.missionService.incrementMissionProgress(+missionId);
  }

  @Patch(':missionId/complete')
  @MissionSwagger.completeMission.operation
  @MissionSwagger.completeMission.param
  @MissionSwagger.completeMission.response
  async completeMission(@Param('missionId') missionId: string) {
    return this.missionService.completeMission(+missionId);
  }
}
