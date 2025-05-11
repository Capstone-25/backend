import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

export const MissionSwagger = {
  getMyMissions: {
    operation: ApiOperation({
      summary: '내 미션 전체 조회',
      description: '진행중인 미션만 sessionId별로 정렬하여 반환합니다.',
    }),
    response: ApiResponse({
      status: 200,
      description: '진행중 미션 목록',
      schema: {
        example: [
          {
            id: 1,
            sessionId: 4,
            title: '감정 일기 쓰기',
            progress: 3,
            frequency: '7회',
            isCompleted: false,
            createdAt: '...',
          },
        ],
      },
    }),
  },
  updateMissionProgress: {
    operation: ApiOperation({ summary: '미션 진척도(progress) 업데이트' }),
    param: ApiParam({
      name: 'missionId',
      description: '업데이트할 미션 ID',
      type: Number,
    }),
    body: ApiBody({ schema: { example: { progress: 5 } } }),
    response: ApiResponse({
      status: 200,
      description: '진척도 업데이트 성공',
      schema: { example: { success: true } },
    }),
  },
  completeMission: {
    operation: ApiOperation({
      summary: '미션 완료 처리',
      description: '진척도를 모두 채우고 완료 처리합니다.',
    }),
    param: ApiParam({
      name: 'missionId',
      description: '완료 처리할 미션 ID',
      type: Number,
    }),
    response: ApiResponse({
      status: 200,
      description: '미션 완료 처리 성공',
      schema: { example: { success: true } },
    }),
  },
};
