import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BasicInfoDTO } from '../dto/BasicInfoDTO';

export const UserSwagger = {
  controller: ApiTags('Users'),
  getMe: {
    operation: ApiOperation({
      summary: '내 정보 조회',
      description: '현재 로그인한 사용자의 정보를 조회합니다.',
    }),
    response: ApiResponse({
      status: 200,
      description: '사용자 정보 조회 성공',
    }),
  },

  updateMe: {
    operation: ApiOperation({
      summary: '내 정보 수정',
      description: '현재 로그인한 사용자의 이름을 수정합니다.',
    }),
    response: ApiResponse({
      status: 200,
      description: '사용자 정보 수정 성공',
    }),
  },

  deleteMe: {
    operation: ApiOperation({
      summary: '회원 탈퇴',
      description: '현재 로그인한 사용자의 계정을 삭제합니다.',
    }),
    response: ApiResponse({
      status: 200,
      description: '회원 탈퇴 성공',
    }),
  },

  createSurvey: {
    operation: ApiOperation({
      summary: '기초 정보 입력',
      description: '사용자의 성별, 나이, 고민유형(카테고리 코드)을 입력하면 맞춤형 심리검사 문항을 반환합니다.',
    }),
    response: ApiResponse({
      status: 200,
      description: '기초 정보 입력 및 맞춤형 심리검사 문항 반환 성공',
      schema: {
        example: {
          surveyType: 'PHQ-9',
          questions: [
            {
              id: 1,
              surveyTypeId: 1,
              ageGroup: 'teen',
              order: 1,
              content: '흥미를 느끼거나 즐거움을 느끼는 일이 거의 없었다.',
              isReverse: false,
            },
            // ...
          ],
        },
      },
    }),
  },

  basicSurveyCompleted: {
    operation: ApiOperation({
      summary: '기초 심리검사 완료 여부 확인',
      description: '로그인한 사용자가 기초 심리검사(회원가입 설문)를 완료했는지 여부를 반환합니다.',
    }),
    response: ApiResponse({
      status: 200,
      description: '기초 심리검사 완료 여부 반환 성공',
      schema: {
        example: { completed: true },
      },
    }),
  },
};
 