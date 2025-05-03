import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const CalendarSwagger = {
  getCalendarEvents: {
    operation: ApiOperation({
      summary: '캘린더 이벤트 조회',
      description: '사용자의 구글 캘린더 이벤트를 조회합니다.',
    }),
    response: ApiResponse({
      status: 200,
      description: '캘린더 이벤트 조회 성공',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: '캘린더 이벤트 조회 성공' },
          events: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'event123' },
                summary: { type: 'string', example: '회의' },
                description: { type: 'string', example: '주간 회의' },
                start: {
                  type: 'object',
                  properties: {
                    dateTime: {
                      type: 'string',
                      example: '2024-05-03T10:00:00+09:00',
                    },
                  },
                },
                end: {
                  type: 'object',
                  properties: {
                    dateTime: {
                      type: 'string',
                      example: '2024-05-03T11:00:00+09:00',
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
  },
};
