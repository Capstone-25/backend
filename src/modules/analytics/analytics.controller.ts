import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from '@src/modules/analytics/analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':sessionId')
  @ApiOperation({
    summary: '채팅방 분석 결과 조회',
    description: '특정 채팅방(sessionId)의 분석 결과(분석 요약)를 조회합니다.',
  })
  @ApiParam({
    name: 'sessionId',
    description: '조회할 채팅방 ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: '분석 결과 조회 성공',
    schema: {
      example: {
        sessionId: 4,
        userId: 4,
        timestamp: '2025-05-11T19:38:36.500723+09:00',
        topic: { '학업/성적 스트레스': 5 },
        emotion: { 슬픔: 45, 불안: 30 },
        distortions: [
          {
            name: '재앙화',
            example: '시험망쳐서 죽고싶어',
            explanation: '...',
            advice: '...',
          },
        ],
      },
    },
  })
  async getSessionAnalytics(@Param('sessionId') sessionId: string) {
    return this.analyticsService.getSessionAnalytics(+sessionId);
  }
}
