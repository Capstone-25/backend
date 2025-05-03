import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateSessionDto } from '../dto/CreateSessionDTO';
import { SendMessageDto } from '../dto/SendMessageDto';
import { ChangePersonaDto } from '../dto/ChangePersonaDTO';
import { ChatResponseDTO } from '../dto/ChatResponseDTO';
import { ChatMessageDTO } from '../dto/ChatMessageDTO';

export const ChatSwagger = {
  createSession: {
    operation: ApiOperation({
      summary: '새로운 채팅방 생성',
      description: '사용자를 위한 새로운 채팅방을 생성합니다.',
    }),
    response: ApiResponse({
      status: 201,
      description: '채팅방 생성 성공',
      type: 'object',
      schema: {
        example: {
          id: 1,
          userId: 1,
          title: '첫 번째 대화',
          createdAt: '2024-05-03T12:00:00.000Z',
        },
      },
    }),
  },

  deleteSession: {
    operation: ApiOperation({
      summary: '채팅방 삭제',
      description: '특정 채팅방을 삭제합니다.',
    }),
    param: ApiParam({
      name: 'sessionId',
      description: '삭제할 채팅방 ID',
      type: 'number',
    }),
    response: ApiResponse({
      status: 200,
      description: '채팅방 삭제 성공',
    }),
  },

  getChatMessages: {
    operation: ApiOperation({
      summary: '채팅방 메시지 조회',
      description: '특정 채팅방의 모든 메시지를 시간순으로 조회합니다.',
    }),
    param: ApiParam({
      name: 'sessionId',
      description: '조회할 채팅방 ID',
      type: 'number',
    }),
    response: ApiResponse({
      status: 200,
      description: '메시지 조회 성공',
      type: [ChatMessageDTO],
    }),
  },

  sendMessage: {
    operation: ApiOperation({
      summary: '메시지 전송',
      description: '채팅방에 메시지를 전송하고 AI 응답을 받습니다.',
    }),
    param: ApiParam({
      name: 'sessionId',
      description: '메시지를 보낼 채팅방 ID',
      type: 'number',
    }),
    body: ApiBody({
      type: SendMessageDto,
      description: '전송할 메시지',
    }),
    response: ApiResponse({
      status: 201,
      description: '메시지 전송 및 AI 응답 수신 성공',
      type: ChatResponseDTO,
    }),
  },

  changePersona: {
    operation: ApiOperation({
      summary: '페르소나 변경',
      description: '채팅방의 AI 페르소나를 변경합니다.',
    }),
    param: ApiParam({
      name: 'sessionId',
      description: '페르소나를 변경할 채팅방 ID',
      type: 'number',
    }),
    body: ApiBody({
      type: ChangePersonaDto,
      description: '변경할 페르소나 정보',
    }),
    response: ApiResponse({
      status: 200,
      description: '페르소나 변경 성공',
      type: 'object',
      schema: {
        example: {
          id: 1,
          persona: '8살_민지원',
        },
      },
    }),
  },

  endSession: {
    operation: ApiOperation({
      summary: '채팅 종료 및 분석',
      description: '채팅을 종료하고 대화 내용을 분석합니다.',
    }),
    param: ApiParam({
      name: 'sessionId',
      description: '종료할 채팅방 ID',
      type: 'number',
    }),
    response: ApiResponse({
      status: 200,
      description: '채팅 종료 및 분석 성공',
      type: 'object',
      schema: {
        example: {
          analysis: {
            emotion: 'positive',
            keyTopics: ['일상', '취미'],
            suggestions: ['일기 작성', '관련 콘텐츠 추천'],
          },
        },
      },
    }),
  },
}; 