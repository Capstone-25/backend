import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSessionAnalytics(sessionId: number): Promise<any> {
    // 1. 분석 요약 조회
    const analysis = await this.prisma.chatAnalysis.findFirst({
      where: { sessionId },
      orderBy: { timestamp: 'desc' },
    });
    if (!analysis) return { sessionId };
    return {
      sessionId,
      userId: analysis.userId,
      timestamp: analysis.timestamp,
      topic: analysis.topic,
      emotion: analysis.emotion,
      distortions: analysis.distortions,
    };
  }
}
