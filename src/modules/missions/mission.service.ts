import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class MissionService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. 내 미션 전체 조회(진행중, sessionId별 정렬)
  async getMyMissions(
    userId: number
  ): Promise<{ progressing: any[]; completed: any[] }> {
    const progressing = await this.prisma.mission.findMany({
      where: { userId, isCompleted: false },
      orderBy: [{ sessionId: 'desc' }, { createdAt: 'asc' }],
    });
    const completed = await this.prisma.mission.findMany({
      where: { userId, isCompleted: true },
      orderBy: [{ sessionId: 'desc' }, { createdAt: 'asc' }],
    });
    return { progressing, completed };
  }

  // 2. 미션 진척도 1 증가
  async incrementMissionProgress(
    missionId: number,
    userId: number
  ): Promise<any> {
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
    let expResult = null;
    if (progress >= target) {
      isCompleted = true;
      completedAt = new Date();
      progress = target;
      // 경험치/레벨 지급
      expResult = await this.completeMissionAndGiveExp(missionId, userId);
    }
    await this.prisma.mission.update({
      where: { id: missionId },
      data: { progress, isCompleted, completedAt },
    });
    return { success: true, ...(expResult ? { expResult } : {}) };
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

  async completeMissionAndGiveExp(missionId: number, userId: number) {
    // 1. 미션 정보 조회
    const mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
    });
    if (!mission) throw new NotFoundException('미션을 찾을 수 없습니다.');
    if (mission.isCompleted)
      throw new BadRequestException('이미 완료된 미션입니다.');

    // 2. 미션 완료 처리
    await this.prisma.mission.update({
      where: { id: missionId },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        progress: mission.frequency
          ? parseInt(mission.frequency.match(/\\d+/)?.[0] || '1', 10)
          : 1,
      },
    });

    // 3. 사용자 경험치/레벨 업데이트
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    let newExp = (user.exp ?? 0) + (mission.missionExp ?? 0);
    let newLevel = user.level ?? 1;
    if (newExp >= 50) {
      newLevel += Math.floor(newExp / 50);
      newExp = newExp % 50;
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { exp: newExp, level: newLevel },
    });

    return { level: newLevel, exp: newExp, gainedExp: mission.missionExp };
  }
}
