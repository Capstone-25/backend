import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. 카테고리 생성 (표 기준으로 모두 추가, upsert 사용)
  const depression = await prisma.surveyCategory.upsert({
    where: { code: 'depression' },
    update: {},
    create: { name: '우울/무기력', code: 'depression' },
  });
  const anxiety = await prisma.surveyCategory.upsert({
    where: { code: 'anxiety' },
    update: {},
    create: { name: '불안/긴장', code: 'anxiety' },
  });
  const relationship = await prisma.surveyCategory.upsert({
    where: { code: 'relationship' },
    update: {},
    create: { name: '대인관계/소통어려움', code: 'relationship' },
  });
  const future = await prisma.surveyCategory.upsert({
    where: { code: 'future' },
    update: {},
    create: { name: '진로/미래불안', code: 'future' },
  });
  const academic = await prisma.surveyCategory.upsert({
    where: { code: 'academic' },
    update: {},
    create: { name: '학업/성적 스트레스', code: 'academic' },
  });
  const work = await prisma.surveyCategory.upsert({
    where: { code: 'work' },
    update: {},
    create: { name: '직장/업무 스트레스', code: 'work' },
  });
  const family = await prisma.surveyCategory.upsert({
    where: { code: 'family' },
    update: {},
    create: { name: '가족문제', code: 'family' },
  });
  const romantic = await prisma.surveyCategory.upsert({
    where: { code: 'romantic' },
    update: {},
    create: { name: '연애/이별', code: 'romantic' },
  });
  const selfUnderstanding = await prisma.surveyCategory.upsert({
    where: { code: 'selfUnderstanding' },
    update: {},
    create: { name: '자기이해/성격 혼란', code: 'selfUnderstanding' },
  });
  const lifestyle = await prisma.surveyCategory.upsert({
    where: { code: 'lifestyle' },
    update: {},
    create: { name: '생활습관/신체 문제', code: 'lifestyle' },
  });
  // ... (필요한 카테고리 추가)

  // 2. 검사 종류 생성 (type: 'simple', upsert 사용)
  const phq9 = await prisma.surveyType.upsert({
    where: { code: 'PHQ-9' },
    update: {},
    create: {
      code: 'PHQ-9',
      name: 'PHQ-9',
      description: '우울/무기력 평가',
      categoryId: depression.id,
      type: 'simple',
    },
  });
  const gad7 = await prisma.surveyType.upsert({
    where: { code: 'GAD-7' },
    update: {},
    create: {
      code: 'GAD-7',
      name: 'GAD-7',
      description: '불안/긴장 평가',
      categoryId: anxiety.id,
      type: 'simple',
    },
  });
  const rses = await prisma.surveyType.upsert({
    where: { code: 'RSES' },
    update: {},
    create: {
      code: 'RSES',
      name: 'RSES',
      description: '자존감 평가',
      categoryId: selfUnderstanding.id,
      type: 'simple',
    },
  });
  const pss = await prisma.surveyType.upsert({
    where: { code: 'PSS' },
    update: {},
    create: {
      code: 'PSS',
      name: 'PSS',
      description: '스트레스 평가',
      categoryId: lifestyle.id,
      type: 'simple',
    },
  });
  const ata = await prisma.surveyType.upsert({
    where: { code: 'ATA' },
    update: {},
    create: {
      code: 'ATA',
      name: 'ATA',
      description: '시험 불안 평가',
      categoryId: academic.id,
      type: 'simple',
    },
  });
  const kfaces = await prisma.surveyType.upsert({
    where: { code: 'K-FACES' },
    update: {},
    create: {
      code: 'K-FACES',
      name: 'K-FACES IV',
      description: '가족 적응력 평가',
      categoryId: family.id,
      type: 'simple',
    },
  });
  const reqo = await prisma.surveyType.upsert({
    where: { code: 'ReQo-10' },
    update: {},
    create: {
      code: 'ReQo-10',
      name: 'ReQo-10',
      description: '연애/이별 자존감 및 정서 척도',
      categoryId: romantic.id,
      type: 'simple',
    },
  });

  // 3. PHQ-9 문항 (teen, adult, senior)
  const phq9Questions = [
    {
      order: 1,
      content: '흥미를 느끼거나 즐거움을 느끼는 일이 거의 없었다.',
      isReverse: false,
    },
    {
      order: 2,
      content: '기분이 가라앉거나 우울하거나 절망적인 느낌이 들었다.',
      isReverse: false,
    },
    {
      order: 3,
      content: '잠들기 어렵거나 자주 깼거나, 또는 너무 많이 잠을 잤다.',
      isReverse: false,
    },
    { order: 4, content: '피로감이나 기운이 없었다.', isReverse: false },
    { order: 5, content: '식욕이 없거나 과식했다.', isReverse: false },
    {
      order: 6,
      content:
        '자신을 실패자라고 느꼈거나, 자신이나 가족을 실망시켰다고 생각했다.',
      isReverse: false,
    },
    {
      order: 7,
      content: '집중하기 어려웠다 (예: 신문 읽기, TV 시청).',
      isReverse: false,
    },
    {
      order: 8,
      content:
        '주변 사람이 알아챌 정도로 말이나 행동이 느려졌거나, 너무 안절부절못했다.',
      isReverse: false,
    },
    {
      order: 9,
      content: '살아있는 것이 싫거나 자해 또는 죽음에 대해 생각했다.',
      isReverse: false,
    },
  ];
  for (const ageGroup of ['teen', 'adult', 'senior']) {
    await prisma.surveyQuestion.createMany({
      data: phq9Questions.map(q => ({
        surveyTypeId: phq9.id,
        ageGroup,
        order: q.order,
        content: q.content,
        isReverse: q.isReverse,
      })),
    });
  }
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: phq9.id,
        minScore: 0,
        maxScore: 4,
        label: '우울 증상 없음 또는 최소',
        description: '',
      },
      {
        surveyTypeId: phq9.id,
        minScore: 5,
        maxScore: 9,
        label: '경증 우울',
        description: '',
      },
      {
        surveyTypeId: phq9.id,
        minScore: 10,
        maxScore: 14,
        label: '중등도 우울',
        description: '',
      },
      {
        surveyTypeId: phq9.id,
        minScore: 15,
        maxScore: 19,
        label: '중등도~중증 우울',
        description: '',
      },
      {
        surveyTypeId: phq9.id,
        minScore: 20,
        maxScore: 27,
        label: '중증 우울 가능성',
        description: '',
      },
    ],
  });

  // 4. GAD-7 문항 (teen, adult, senior)
  const gad7Questions = [
    { order: 1, content: '초조하거나 긴장된 느낌이 있었다.', isReverse: false },
    {
      order: 2,
      content: '걱정을 멈추거나 조절하기 어려웠다.',
      isReverse: false,
    },
    {
      order: 3,
      content: '여러 가지 일들에 대해 지나치게 걱정했다.',
      isReverse: false,
    },
    { order: 4, content: '긴장을 푸는 것이 어려웠다.', isReverse: false },
    {
      order: 5,
      content: '너무 안절부절못하거나 산만한 느낌이 들었다.',
      isReverse: false,
    },
    { order: 6, content: '쉽게 짜증이 났다.', isReverse: false },
    {
      order: 7,
      content: '과도한 걱정 때문에 일상생활에 지장이 있었다.',
      isReverse: false,
    },
  ];
  for (const ageGroup of ['teen', 'adult', 'senior']) {
    await prisma.surveyQuestion.createMany({
      data: gad7Questions.map(q => ({
        surveyTypeId: gad7.id,
        ageGroup,
        order: q.order,
        content: q.content,
        isReverse: q.isReverse,
      })),
    });
  }
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: gad7.id,
        minScore: 0,
        maxScore: 4,
        label: '최소 불안',
        description: '',
      },
      {
        surveyTypeId: gad7.id,
        minScore: 5,
        maxScore: 9,
        label: '경증 불안',
        description: '',
      },
      {
        surveyTypeId: gad7.id,
        minScore: 10,
        maxScore: 14,
        label: '중등도 불안',
        description: '',
      },
      {
        surveyTypeId: gad7.id,
        minScore: 15,
        maxScore: 21,
        label: '중증 불안',
        description: '',
      },
    ],
  });

  // 5. RSES(자존감) 문항 (teen, adult, senior)
  const rsesQuestions = [
    {
      order: 1,
      content: '나는 내 자신에 대해 긍정적으로 느낀다.',
      isReverse: false,
    },
    {
      order: 2,
      content: '나는 내 장점에 대해 자부심을 느낀다.',
      isReverse: false,
    },
    {
      order: 3,
      content: '나는 전반적으로 쓸모 있는 사람이라고 느낀다.',
      isReverse: false,
    },
    { order: 4, content: '나는 나에게 만족한다.', isReverse: false },
    { order: 5, content: '나는 좋은 자질을 갖고 있다.', isReverse: false },
    { order: 6, content: '나는 종종 내가 실패자라고 느낀다.', isReverse: true },
    {
      order: 7,
      content: '나는 때때로 내가 아무 쓸모 없는 사람이라고 느낀다.',
      isReverse: true,
    },
    {
      order: 8,
      content: '나는 종종 나 자신을 부정적으로 평가한다.',
      isReverse: true,
    },
    {
      order: 9,
      content: '나는 나 자신에 실망하는 경우가 많다.',
      isReverse: true,
    },
    { order: 10, content: '나는 나 자신을 존중한다.', isReverse: false },
  ];
  for (const ageGroup of ['teen', 'adult', 'senior']) {
    await prisma.surveyQuestion.createMany({
      data: rsesQuestions.map(q => ({
        surveyTypeId: rses.id,
        ageGroup,
        order: q.order,
        content: q.content,
        isReverse: q.isReverse,
      })),
    });
  }
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: rses.id,
        minScore: 0,
        maxScore: 14,
        label: '낮은 자존감 가능성',
        description: '',
      },
      {
        surveyTypeId: rses.id,
        minScore: 15,
        maxScore: 25,
        label: '정상 범위',
        description: '',
      },
      {
        surveyTypeId: rses.id,
        minScore: 26,
        maxScore: 40,
        label: '높은 자존감',
        description: '',
      },
    ],
  });

  // 6. PSS(스트레스) 문항 (teen, adult, senior)
  const pssQuestions = [
    {
      order: 1,
      content: '예상치 못한 일 때문에 불안하거나 당황한 적이 있었다.',
      isReverse: false,
    },
    {
      order: 2,
      content: '중요한 일들을 통제할 수 없다고 느꼈다.',
      isReverse: false,
    },
    { order: 3, content: '긴장하거나 스트레스를 받았다.', isReverse: false },
    {
      order: 4,
      content: '일이 내 뜻대로 되지 않는다고 느꼈다.',
      isReverse: false,
    },
    {
      order: 5,
      content: '너무 많은 어려움으로 극복이 힘들다고 느꼈다.',
      isReverse: false,
    },
    { order: 6, content: '중요한 일을 잘 처리했다고 느꼈다.', isReverse: true },
    { order: 7, content: '상황을 잘 통제하고 있다고 느꼈다.', isReverse: true },
    { order: 8, content: '성질을 잘 조절했다고 느꼈다.', isReverse: true },
    { order: 9, content: '일이 잘 풀린다고 느꼈다.', isReverse: true },
    {
      order: 10,
      content: '개인 문제들을 잘 해결할 수 있다고 느꼈다.',
      isReverse: true,
    },
  ];
  for (const ageGroup of ['teen', 'adult', 'senior']) {
    await prisma.surveyQuestion.createMany({
      data: pssQuestions.map(q => ({
        surveyTypeId: pss.id,
        ageGroup,
        order: q.order,
        content: q.content,
        isReverse: q.isReverse,
      })),
    });
  }
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: pss.id,
        minScore: 0,
        maxScore: 13,
        label: '낮은 스트레스',
        description: '',
      },
      {
        surveyTypeId: pss.id,
        minScore: 14,
        maxScore: 26,
        label: '중간 스트레스',
        description: '',
      },
      {
        surveyTypeId: pss.id,
        minScore: 27,
        maxScore: 40,
        label: '높은 스트레스 가능성',
        description: '',
      },
    ],
  });

  // 7. ATA(시험 불안) 문항 (teen, adult, senior)
  const ataQuestions = [
    {
      order: 1,
      content: '시험을 앞두고 잠들기 어렵거나 자주 깬다.',
      isReverse: false,
    },
    {
      order: 2,
      content: '시험을 앞두고 배가 아프거나 소화불량을 경험한다.',
      isReverse: false,
    },
    {
      order: 3,
      content: '시험 직전 심장이 빠르게 뛰거나 손에 땀이 난다.',
      isReverse: false,
    },
    {
      order: 4,
      content: '시험 중 머릿속이 하얘져서 문제를 읽지 못한다.',
      isReverse: false,
    },
    {
      order: 5,
      content: '좋은 성적을 받지 못할까봐 두려움을 느낀다.',
      isReverse: false,
    },
    {
      order: 6,
      content: '시험 중 실수할까봐 지나치게 긴장한다.',
      isReverse: false,
    },
    {
      order: 7,
      content: '시험을 생각하면 식욕이 줄어들거나 체중이 변한다.',
      isReverse: false,
    },
    {
      order: 8,
      content: '다른 사람들과 비교해 나의 시험 불안이 더 크다고 느낀다.',
      isReverse: false,
    },
    {
      order: 9,
      content: '시험 이후에도 결과에 대해 지나치게 걱정하거나 후회한다.',
      isReverse: false,
    },
    {
      order: 10,
      content: '시험 준비 중 집중이 어렵고 산만한 상태가 지속된다.',
      isReverse: false,
    },
  ];
  for (const ageGroup of ['teen', 'adult', 'senior']) {
    await prisma.surveyQuestion.createMany({
      data: ataQuestions.map(q => ({
        surveyTypeId: ata.id,
        ageGroup,
        order: q.order,
        content: q.content,
        isReverse: q.isReverse,
      })),
    });
  }
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: ata.id,
        minScore: 10,
        maxScore: 25,
        label: '정상 범위',
        description: '',
      },
      {
        surveyTypeId: ata.id,
        minScore: 26,
        maxScore: 40,
        label: '중간 정도의 불안',
        description: '',
      },
      {
        surveyTypeId: ata.id,
        minScore: 41,
        maxScore: 50,
        label: '심각한 시험 불안',
        description: '',
      },
    ],
  });

  // 8. K-FACES IV(가족 적응력 평가) 문항 (teen, adult, senior)
  const kfacesQuestions = [
    { order: 1, content: '우리 가족은 서로를 신뢰한다.', isReverse: false },
    {
      order: 2,
      content: '가족 구성원들은 서로의 의견을 존중한다.',
      isReverse: false,
    },
    {
      order: 3,
      content: '가족 내에서 감정을 자유롭게 표현할 수 있다.',
      isReverse: false,
    },
    {
      order: 4,
      content: '가족 구성원들은 서로의 성취를 축하한다.',
      isReverse: false,
    },
    {
      order: 5,
      content: '가족은 어려운 시기에 서로를 지지한다.',
      isReverse: false,
    },
    {
      order: 6,
      content: '가족 내 갈등은 건설적으로 해결된다.',
      isReverse: false,
    },
    {
      order: 7,
      content: '가족 구성원들은 서로의 사생활을 존중한다.',
      isReverse: false,
    },
    {
      order: 8,
      content: '가족은 함께 시간을 보내는 것을 중요하게 생각한다.',
      isReverse: false,
    },
    {
      order: 9,
      content: '가족 구성원들은 서로의 관심사에 관심을 가진다.',
      isReverse: false,
    },
    {
      order: 10,
      content: '가족 내에서 결정은 공동으로 이루어진다.',
      isReverse: false,
    },
  ];
  for (const ageGroup of ['teen', 'adult', 'senior']) {
    await prisma.surveyQuestion.createMany({
      data: kfacesQuestions.map(q => ({
        surveyTypeId: kfaces.id,
        ageGroup,
        order: q.order,
        content: q.content,
        isReverse: q.isReverse,
      })),
    });
  }
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: kfaces.id,
        minScore: 10,
        maxScore: 25,
        label: '가족 기능 약화 가능성',
        description: '',
      },
      {
        surveyTypeId: kfaces.id,
        minScore: 26,
        maxScore: 40,
        label: '보통 수준',
        description: '',
      },
      {
        surveyTypeId: kfaces.id,
        minScore: 41,
        maxScore: 50,
        label: '높은 가족 적응력',
        description: '',
      },
    ],
  });

  // 9. ReQo-10(연애/이별 자존감 및 정서 척도) 문항 (teen, adult, senior)
  const reqoQuestions = [
    {
      order: 1,
      content: '최근 이별이나 연애 문제로 인해 감정 기복이 심했다.',
      isReverse: false,
    },
    {
      order: 2,
      content: '이별 후에도 상대방에 대한 미련이 남아 있다.',
      isReverse: false,
    },
    {
      order: 3,
      content: '연애/이별로 인해 자존감이 낮아진 것 같다.',
      isReverse: false,
    },
    {
      order: 4,
      content: '이별 후 일상생활에 집중하기 힘들었다.',
      isReverse: false,
    },
    {
      order: 5,
      content: '연애/이별 문제로 인해 수면이나 식욕에 변화가 있었다.',
      isReverse: false,
    },
    {
      order: 6,
      content: '이별 후에도 상대방과 연락을 계속하고 싶었다.',
      isReverse: false,
    },
    {
      order: 7,
      content: '연애/이별 문제로 인해 자기비판이 심해졌다.',
      isReverse: false,
    },
    {
      order: 8,
      content: '이별 후에도 상대방의 SNS를 자주 확인했다.',
      isReverse: false,
    },
    {
      order: 9,
      content: '연애/이별 문제로 인해 감정적으로 불안정했다.',
      isReverse: false,
    },
    {
      order: 10,
      content: '이별 후에도 새로운 관계를 시작하는 것이 두려웠다.',
      isReverse: false,
    },
  ];
  for (const ageGroup of ['teen', 'adult', 'senior']) {
    await prisma.surveyQuestion.createMany({
      data: reqoQuestions.map(q => ({
        surveyTypeId: reqo.id,
        ageGroup,
        order: q.order,
        content: q.content,
        isReverse: q.isReverse,
      })),
    });
  }
  // ReQo-10 점수 해석(감정/자기 분리): 감정 점수(0~18: 정서 안정, 6~10: 감정 부담 있음, 11~18: 감정적 과부하), 자기 점수(4~8: 낮은 자존감, 9~12: 자기비판 경향, 13~16: 건강한 자존감)
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: reqo.id,
        minScore: 0,
        maxScore: 5,
        label: '정서 안정',
        description: '감정 점수',
      },
      {
        surveyTypeId: reqo.id,
        minScore: 6,
        maxScore: 10,
        label: '감정 부담 있음',
        description: '감정 점수',
      },
      {
        surveyTypeId: reqo.id,
        minScore: 11,
        maxScore: 18,
        label: '감정적 과부하 가능성',
        description: '감정 점수',
      },
      {
        surveyTypeId: reqo.id,
        minScore: 4,
        maxScore: 8,
        label: '낮은 자존감, 관계 의존 가능성',
        description: '자기 점수',
      },
      {
        surveyTypeId: reqo.id,
        minScore: 9,
        maxScore: 12,
        label: '자기비판 경향 있음',
        description: '자기 점수',
      },
      {
        surveyTypeId: reqo.id,
        minScore: 13,
        maxScore: 16,
        label: '건강한 자존감',
        description: '자기 점수',
      },
    ],
  });

  // SurveyAssignment(고민유형-연령대-설문 매핑) 추가 (기존 + 새 카테고리 반영)
  // teen(14~19세)
  await prisma.surveyAssignment.createMany({
    data: [
      // 우울/무기력
      { categoryId: depression.id, ageGroup: 'teen', surveyTypeId: phq9.id },
      // 불안/긴장
      { categoryId: anxiety.id, ageGroup: 'teen', surveyTypeId: gad7.id },
      // 대인관계/소통어려움
      { categoryId: relationship.id, ageGroup: 'teen', surveyTypeId: rses.id },
      // 진로/미래불안
      { categoryId: future.id, ageGroup: 'teen', surveyTypeId: pss.id },
      // 학업/성적 스트레스
      { categoryId: future.id, ageGroup: 'teen', surveyTypeId: ata.id },
      { categoryId: future.id, ageGroup: 'teen', surveyTypeId: gad7.id },
      // 가족문제
      { categoryId: family.id, ageGroup: 'teen', surveyTypeId: kfaces.id },
      // 연애/이별
      { categoryId: romantic.id, ageGroup: 'teen', surveyTypeId: reqo.id },
      // 자기이해/성격혼란
      { categoryId: relationship.id, ageGroup: 'teen', surveyTypeId: rses.id },
      // 생활습관/신체문제
      { categoryId: future.id, ageGroup: 'teen', surveyTypeId: pss.id },
    ],
  });
  // adult(20~50세)
  await prisma.surveyAssignment.createMany({
    data: [
      // 우울/무기력
      { categoryId: depression.id, ageGroup: 'adult', surveyTypeId: phq9.id },
      // 불안/긴장
      { categoryId: anxiety.id, ageGroup: 'adult', surveyTypeId: gad7.id },
      // 대인관계/소통어려움
      { categoryId: relationship.id, ageGroup: 'adult', surveyTypeId: rses.id },
      // 진로/미래불안
      { categoryId: future.id, ageGroup: 'adult', surveyTypeId: pss.id },
      // 학업/성적 스트레스
      { categoryId: future.id, ageGroup: 'adult', surveyTypeId: phq9.id },
      { categoryId: future.id, ageGroup: 'adult', surveyTypeId: pss.id },
      // 직장/업무 스트레스
      { categoryId: future.id, ageGroup: 'adult', surveyTypeId: pss.id },
      // 가족문제
      { categoryId: family.id, ageGroup: 'adult', surveyTypeId: kfaces.id },
      // 연애/이별
      { categoryId: romantic.id, ageGroup: 'adult', surveyTypeId: reqo.id },
      // 자기이해/성격혼란
      { categoryId: relationship.id, ageGroup: 'adult', surveyTypeId: rses.id },
      // 생활습관/신체문제
      { categoryId: future.id, ageGroup: 'adult', surveyTypeId: pss.id },
    ],
  });
  // senior(51세 이상)
  await prisma.surveyAssignment.createMany({
    data: [
      // 우울/무기력
      { categoryId: depression.id, ageGroup: 'senior', surveyTypeId: phq9.id },
      // 불안/긴장
      { categoryId: anxiety.id, ageGroup: 'senior', surveyTypeId: pss.id },
      // 대인관계/소통어려움
      {
        categoryId: relationship.id,
        ageGroup: 'senior',
        surveyTypeId: rses.id,
      },
      // 진로/미래불안
      { categoryId: future.id, ageGroup: 'senior', surveyTypeId: pss.id },
      // 직장/업무 스트레스
      { categoryId: future.id, ageGroup: 'senior', surveyTypeId: pss.id },
      // 가족문제
      { categoryId: family.id, ageGroup: 'senior', surveyTypeId: kfaces.id },
      // 연애/이별
      { categoryId: romantic.id, ageGroup: 'senior', surveyTypeId: reqo.id },
      // 자기이해/성격혼란
      {
        categoryId: relationship.id,
        ageGroup: 'senior',
        surveyTypeId: rses.id,
      },
      // 생활습관/신체문제
      { categoryId: future.id, ageGroup: 'senior', surveyTypeId: pss.id },
    ],
  });

  // lifestyle(생활습관/신체문제) → PSS
  await prisma.surveyAssignment.createMany({
    data: [
      { categoryId: lifestyle.id, ageGroup: 'teen', surveyTypeId: pss.id },
      { categoryId: lifestyle.id, ageGroup: 'adult', surveyTypeId: pss.id },
      { categoryId: lifestyle.id, ageGroup: 'senior', surveyTypeId: pss.id },
    ],
  });
  // academic(학업/성적 스트레스)
  await prisma.surveyAssignment.createMany({
    data: [
      { categoryId: academic.id, ageGroup: 'teen', surveyTypeId: ata.id },
      { categoryId: academic.id, ageGroup: 'teen', surveyTypeId: gad7.id },
      { categoryId: academic.id, ageGroup: 'adult', surveyTypeId: phq9.id },
      { categoryId: academic.id, ageGroup: 'adult', surveyTypeId: pss.id },
      // senior는 없음
    ],
  });
  // work(직장/업무 스트레스) → PSS
  await prisma.surveyAssignment.createMany({
    data: [
      { categoryId: work.id, ageGroup: 'adult', surveyTypeId: pss.id },
      { categoryId: work.id, ageGroup: 'senior', surveyTypeId: pss.id },
      // teen은 없음
    ],
  });
  // selfUnderstanding(자기이해/성격혼란) → RSES
  await prisma.surveyAssignment.createMany({
    data: [
      {
        categoryId: selfUnderstanding.id,
        ageGroup: 'teen',
        surveyTypeId: rses.id,
      },
      {
        categoryId: selfUnderstanding.id,
        ageGroup: 'adult',
        surveyTypeId: rses.id,
      },
      {
        categoryId: selfUnderstanding.id,
        ageGroup: 'senior',
        surveyTypeId: rses.id,
      },
    ],
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
