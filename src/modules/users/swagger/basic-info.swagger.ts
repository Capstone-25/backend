import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

export const CATEGORY_CODES = [
  'depression', // 우울/무기력
  'anxiety', // 불안/긴장
  'relationship', // 대인관계/소통어려움
  'future', // 진로/미래불안
  'academic', // 학업/성적 스트레스
  'work', // 직장/업무 스트레스
  'family', // 가족문제
  'romantic', // 연애/이별
  'selfUnderstanding', // 자기이해/성격 혼란
  'lifestyle', // 생활습관/신체 문제
];

export const BasicInfoSwagger = {
  getQuestions: {
    operation: ApiOperation({
      summary: '기초 설문조사 문항 조회',
      description:
        '나이, 성별, 고민 카테고리를 입력하면 나이, 성별을 저장하고 해당 조건에 맞는 설문 문항과 척도(minScale, maxScale)를 반환합니다. 고민 카테고리 코드는 다음과 같습니다. ' +
        CATEGORY_CODES.join(', '),
    }),
    body: ApiBody({
      schema: {
        type: 'object',
        properties: {
          age: { type: 'integer', example: 25 },
          gender: { type: 'string', example: 'male' },
          categoryCode: {
            type: 'string',
            enum: CATEGORY_CODES,
            example: 'depression',
            description:
              '고민 카테고리 코드. 가능한 값: ' + CATEGORY_CODES.join(', '),
          },
        },
        required: ['age', 'gender', 'categoryCode'],
      },
    }),
    response: ApiResponse({
      status: 200,
      description: '설문 문항 및 척도 반환',
      schema: {
        type: 'object',
        properties: {
          surveyType: { type: 'string', example: 'PHQ-9' },
          minScale: { type: 'integer', example: 0 },
          maxScale: { type: 'integer', example: 3 },
          questions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 149 },
                surveyTypeId: { type: 'integer', example: 6 },
                ageGroup: { type: 'string', example: 'adult' },
                order: { type: 'integer', example: 1 },
                content: {
                  type: 'string',
                  example: '우리 가족은 서로를 신뢰한다.',
                },
                isReverse: { type: 'boolean', example: false },
              },
            },
          },
        },
      },
    }),
  },
  submit: {
    operation: ApiOperation({
      summary: '기초 설문조사 답변 제출',
      description:
        '설문 타입과 답변 배열을 제출하면 점수와 해석 결과를 반환합니다.',
    }),
    body: ApiBody({
      schema: {
        type: 'object',
        properties: {
          surveyType: { type: 'string', example: 'PHQ-9' },
          answers: {
            type: 'array',
            items: { type: 'integer', example: 2 },
            description:
              '각 문항에 대한 응답값 배열 (minScale~maxScale 범위의 값)',
          },
        },
        required: ['surveyType', 'answers'],
      },
    }),
    response: ApiResponse({
      status: 200,
      description: '점수 및 해석 결과 반환',
      schema: {
        type: 'object',
        properties: {
          totalScore: { type: 'integer', example: 12 },
          interpretation: { type: 'string', example: '경미한 우울 경향' },
        },
      },
    }),
  },
};
