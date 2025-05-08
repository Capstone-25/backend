import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

export const CATEGORY_CODES = [
  'depression', // 우울/무기력
  'anxiety', // 불안/긴장
  'relationship', // 대인관계/소통어려움
  'future', // 진로/미래불안
  'academic', // 학업/성적 스트레스
  'work', // 직장/업무 스트레스
  'family', // 가족문제
  'attachment', // 애착
  'big5', // 성격(빅5)
  'health', // 건강행동
  'dissociation', // 해리/정체감
];

const CATEGORY_DESC =
  'categoryCode는 다음 중 하나입니다: ' +
  '\n- depression(우울/무기력)' +
  '\n- anxiety(불안/긴장)' +
  '\n- relationship(대인관계/소통어려움)' +
  '\n- future(진로/미래불안)' +
  '\n- academic(학업/성적 스트레스)' +
  '\n- work(직장/업무 스트레스)' +
  '\n- family(가족문제)' +
  '\n- attachment(애착)' +
  '\n- big5(성격(빅5))' +
  '\n- health(건강행동)' +
  '\n- dissociation(해리/정체감)';

export const ProfessionalSurveySwagger = {
  history: {
    operation: ApiOperation({
      summary: '전문 설문조사 전체 목록',
      description: '내가 응시한 모든 전문 설문조사 결과 목록을 반환합니다.',
    }),
    response: ApiResponse({
      status: 200,
      description: '전문 설문조사 목록',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            surveyType: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'IPIP-DEP' },
                name: { type: 'string', example: 'IPIP Depression Scale' },
              },
            },
            totalScore: { type: 'integer', example: 85 },
            interpretation: { type: 'string', example: '경미한 우울 경향' },
            createdAt: { type: 'string', example: '2024-05-03T12:00:00.000Z' },
          },
        },
      },
    }),
  },
  detail: {
    operation: ApiOperation({
      summary: '전문 설문조사 상세',
      description: '특정 전문 설문조사 결과(점수, 해석 등) 상세 조회',
    }),
    param: ApiParam({
      name: 'userSurveyId',
      type: 'integer',
      description: 'UserSurvey 고유 ID',
    }),
    response: ApiResponse({
      status: 200,
      description: '전문 설문조사 상세',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          surveyType: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'IPIP-DEP' },
              name: { type: 'string', example: 'IPIP Depression Scale' },
            },
          },
          totalScore: { type: 'integer', example: 85 },
          interpretation: { type: 'string', example: '경미한 우울 경향' },
          resultLabel: { type: 'string', example: '경미한 우울 경향' },
          resultDescription: {
            type: 'string',
            example: '경미한 우울 경향에 해당합니다.',
          },
          answers: { type: 'array', items: { type: 'integer', example: 3 } },
          createdAt: { type: 'string', example: '2024-05-03T12:00:00.000Z' },
        },
      },
    }),
  },
  start: {
    operation: ApiOperation({
      summary: '전문 설문조사 시작',
      description:
        '카테고리 선택 시 해당 전문 설문 문항과 척도 반환. ' + CATEGORY_DESC,
    }),
    body: ApiBody({
      schema: {
        type: 'object',
        properties: {
          categoryCode: {
            type: 'string',
            enum: CATEGORY_CODES,
            example: 'depression',
            description: CATEGORY_DESC,
          },
        },
        required: ['categoryCode'],
      },
    }),
    response: ApiResponse({
      status: 200,
      description: '설문 문항 및 척도 반환',
      schema: {
        type: 'object',
        properties: {
          surveyType: { type: 'string', example: 'IPIP-DEP' },
          minScale: { type: 'integer', example: 1 },
          maxScale: { type: 'integer', example: 5 },
          questions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 101 },
                order: { type: 'integer', example: 1 },
                content: {
                  type: 'string',
                  example: '나는 종종 이유 없이 기분이 가라앉는다.',
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
      summary: '전문 설문조사 결과 제출',
      description:
        '설문 타입과 답변 배열을 제출하면 점수와 해석 결과를 반환합니다.',
    }),
    body: ApiBody({
      schema: {
        type: 'object',
        properties: {
          surveyType: {
            type: 'string',
            example: 'IPIP-DEP',
            description:
              '설문 코드(예: IPIP-DEP, IPIP-ANX, IPIP-ASS, LOCUS-CTRL, ASS, OSI, IPIP-FAM, ASQ-SF, IPIP-NEO-60, HBC, MID-60 등).\n각 설문별 문항 수와 척도는 /surveys/start 응답 참고.\nASQ-SF(attachment) 설문은 결과 해석이 불안(1~20번), 회피(21~40번) 평균점수로 산출됨.',
          },
          answers: {
            type: 'array',
            items: { type: 'integer', example: 3 },
            description:
              '각 문항에 대한 응답값 배열.\n- 각 값은 해당 설문 척도(minScale~maxScale) 범위의 정수여야 함.\n- 배열 길이는 설문별 문항 수와 일치해야 함.\n  예) IPIP-DEP: 30개, IPIP-ANX: 30개, IPIP-ASS: 30개, LOCUS-CTRL: 45개, ASS: 34개, OSI: 46개, IPIP-FAM: 36개, ASQ-SF: 40개, IPIP-NEO-60: 60개, HBC: 40개, MID-60: 60개 등\n- ASQ-SF(attachment) 설문은 1~20번(불안), 21~40번(회피)로 구분되어 평균점수로 해석됨.',
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
          totalScore: { type: 'integer', example: 85 },
          interpretation: { type: 'string', example: '경미한 우울 경향' },
          userSurveyId: { type: 'integer', example: 1 },
        },
      },
    }),
  },
};
