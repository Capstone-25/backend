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
      description: '사용자의 성별과 나이를 입력합니다.',
    }),
    response: ApiResponse({
      status: 200,
      description: '기초 정보 입력 성공',
    }),
  },
};
 