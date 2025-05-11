import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class MissionService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. 내 미션 전체 조회(진행중, sessionId별 정렬)
  async getMyMissions(userId: number): Promise<any[]> {
    return this.prisma.mission.findMany({
      where: { userId, isCompleted: false },
      orderBy: [{ sessionId: 'desc' }, { createdAt: 'asc' }],
    });
  }

  // 2. 미션 진척도 1 증가
  async incrementMissionProgress(missionId: number): Promise<any> {
    const mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
    });
    if (!mission) throw new NotFoundException('미션을 찾을 수 없습니다.');
    let target = 1;
    if (mission.frequency) {
      const match = mission.frequency.match(/\d+/);
      if (match) target = parseInt(match[0], 10);
    }
    let progress = (mission.progress ?? 0) + 1;
    let isCompleted = false;
    let completedAt = null;
    if (progress >= target) {
      isCompleted = true;
      completedAt = new Date();
      progress = target;
    }
    await this.prisma.mission.update({
      where: { id: missionId },
      data: { progress, isCompleted, completedAt },
    });
    return { success: true };
  }

  // 3. 미션 완료 처리(진척도 모두 채움)
  async completeMission(missionId: number): Promise<any> {
    const mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
    });
    if (!mission) throw new NotFoundException('미션을 찾을 수 없습니다.');
    let target = 1;
    if (mission.frequency) {
      const match = mission.frequency.match(/\d+/);
      if (match) target = parseInt(match[0], 10);
    }
    await this.prisma.mission.update({
      where: { id: missionId },
      data: { progress: target, isCompleted: true, completedAt: new Date() },
    });
    return { success: true };
  }
}
