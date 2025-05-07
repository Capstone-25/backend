import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

export const VoiceChatSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: '음성 채팅',
      description:
        '음성 텍스트(message)와 세션ID를 받아 AI 서버에 요청하고 응답을 반환합니다.',
    }),
    ApiConsumes('application/json'),
    ApiParam({
      name: 'sessionId',
      type: 'number',
      description: '채팅 세션 ID',
      example: 1,
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '음성 인식 결과 텍스트',
            example: '안녕하세요',
          },
        },
        required: ['message'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'AI 서버 응답 성공',
      schema: {
        type: 'object',
        properties: {
          userId: {
            type: 'number',
            description: '사용자 ID',
            example: 1,
          },
          chatId: {
            type: 'number',
            description: '채팅방 ID',
            example: 1,
          },
          message: {
            type: 'string',
            description: '사용자 메시지',
            example: '안녕하세요',
          },
          botResponse: {
            type: 'string',
            description: 'AI의 텍스트 응답',
            example: '안녕하세요! 무엇을 도와드릴까요?',
          },
          audioResponse: {
            type: 'string',
            description: 'AI의 음성 응답 URL',
            example: 'http://ai-server/audio/response.mp3',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: '응답 시간',
            example: '2024-03-21T12:00:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: '인증 실패',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 401,
          },
          message: {
            type: 'string',
            example: 'Unauthorized',
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'AI 서버 처리 실패',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 500,
          },
          message: {
            type: 'string',
            example: 'AI 서버 처리 실패',
          },
        },
      },
    })
  );
};
