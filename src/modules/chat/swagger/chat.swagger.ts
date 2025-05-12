import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateSessionDto } from '../dto/CreateSessionDto';
import { SendMessageDto } from '../dto/SendMessageDto';
import { ChangePersonaDto } from '../dto/ChangePersonaDto';
import { ChatResponseDto } from '../dto/ChatResponseDto';
import { ChatMessageDto } from '../dto/ChatMessageDto';

export const ChatSwagger = {
  createSession: {
    operation: ApiOperation({
      summary: '새로운 채팅방 생성',
      description: '사용자를 위한 새로운 채팅방을 생성합니다.',
    }),
    body: ApiBody({
      type: CreateSessionDto,
      description: '채팅방 제목',
    }),
    response: ApiResponse({
      status: 201,
      description: '채팅방 생성 성공',
      type: 'object',
      schema: {
        example: {
          chatId: 1,
          userId: 1,
          title: '첫 번째 대화',
          persona: '26살_한여름',
          createdAt: '2024-05-03T12:00:00.000Z',
          updatedAt: '2024-05-03T12:00:00.000Z',
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
      type: [ChatMessageDto],
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
      type: ChatResponseDto,
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
      description:
        '채팅을 종료하고 대화 내용을 분석합니다.\n\n※ 15턴(메시지) 이상 대화해야 분석이 가능합니다. 15턴 미만일 경우 400 에러가 반환됩니다.',
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
          userId: 4,
          chatId: 4,
          timestamp: '2025-05-11T19:38:36.500723+09:00',
          report: {
            missionTopic: { '학업/성적 스트레스': 5 },
            missionEmotion: { 슬픔: 45, 불안: 30 },
            missionDistortion: [
              {
                name: '재앙화',
                example: '시험망쳐서 죽고싶어',
                explanation: '...',
                advice: '...',
              },
            ],
            missions: [
              {
                title: '감정 일기 쓰기',
                detail: '...',
                period: '1주일',
                frequency: '7회',
              },
            ],
          },
        },
      },
    }),
    errorResponse: ApiResponse({
      status: 400,
      description: '15턴 미만일 때: 분석 불가 에러',
      schema: {
        example: {
          statusCode: 400,
          message: '15턴 이상 대화 시 분석이 가능합니다.',
          error: 'Bad Request',
        },
      },
    }),
  },

  greet: {
    operation: ApiOperation({
      summary: '인사 메시지 전송',
      description: '채팅방에 인사 메시지를 전송합니다.',
    }),
    param: ApiParam({
      name: 'sessionId',
      description: '인사 메시지를 보낼 채팅방 ID',
      type: 'number',
    }),
    response: ApiResponse({
      status: 200,
      description: '인사 메시지 전송 성공',
      type: 'object',
      schema: {
        example: {
          userId: 4,
          chatId: 4,
          greet: '안녕하세요! 오늘은 어떤 이야기를 나누고 싶으신가요?',
          timestamp: '2025-05-11T19:38:36.500723+09:00',
        },
      },
    }),
  },
};
