import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

export const AuthSwagger = {
  googleLogin: {
    operation: ApiOperation({
      summary: '구글 로그인',
      description: '구글 OAuth 로그인을 시작합니다.',
    }),
  },

  googleCallback: {
    operation: ApiOperation({
      summary: '구글 로그인 콜백',
      description:
        '구글 OAuth 인증 후 accessToken을 쿼리스트링으로 프론트엔드에 전달합니다.',
    }),
    response: ApiResponse({
      status: 302,
      description: 'accessToken을 쿼리스트링으로 프론트엔드에 리디렉션',
      schema: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    }),
  },

  logout: {
    operation: ApiOperation({
      summary: '로그아웃',
      description: '사용자를 로그아웃합니다.',
    }),
    response: ApiResponse({ status: 200, description: '로그아웃 성공' }),
  },

  signup: {
    operation: ApiOperation({
      summary: '회원가입',
      description: '새로운 사용자를 등록합니다.',
    }),
    body: ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'user@example.com' },
          name: { type: 'string', example: '홍길동' },
          password: { type: 'string', example: 'password123' },
        },
      },
    }),
    response: ApiResponse({ status: 201, description: '회원가입 성공' }),
  },

  login: {
    operation: ApiOperation({
      summary: '로그인',
      description: '사용자 로그인을 처리합니다.',
    }),
    body: ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'user@example.com' },
          password: { type: 'string', example: 'password123' },
        },
      },
    }),
    response: ApiResponse({ status: 200, description: '로그인 성공' }),
  },

  refresh: {
    operation: ApiOperation({
      summary: '토큰 갱신',
      description: '액세스 토큰을 갱신합니다.',
    }),
    response: ApiResponse({ status: 200, description: '토큰 갱신 성공' }),
  },
};
