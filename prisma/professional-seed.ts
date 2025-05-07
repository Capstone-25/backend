import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. 카테고리(우울/무기력) upsert
  const depression = await prisma.surveyCategory.upsert({
    where: { code: 'depression' },
    update: {},
    create: { name: '우울/무기력', code: 'depression' },
  });

  // 2. IPIP Depression Scale 설문타입 생성 (type: 'professional')
  const ipipDepression = await prisma.surveyType.upsert({
    where: { code: 'IPIP-DEP' },
    update: {},
    create: {
      code: 'IPIP-DEP',
      name: 'IPIP Depression Scale',
      description: 'IPIP 기반 우울/무기력 전문 설문',
      categoryId: depression.id,
      type: 'professional',
    },
  });

  // 3. 30문항 생성 (ageGroup: 'all')
  const questions = [
    '나는 종종 이유 없이 기분이 가라앉는다.',
    '나는 아침에 일어나는 것이 힘들다.',
    '나는 예전만큼 즐겁게 느껴지는 일이 없다.',
    '나는 자주 지치고 에너지가 없다.',
    '나는 자주 슬픈 감정을 느낀다.',
    '나는 자주 아무것도 하고 싶지 않다.',
    '나는 미래에 대한 희망이 없다.',
    '나는 사람들이 나를 싫어한다고 느낀다.',
    '나는 자존감이 낮다고 느낀다.',
    '나는 자주 무가치하다고 느낀다.',
    '나는 식욕이 없다거나 너무 많이 먹는다.',
    '나는 수면이 불규칙하다.',
    '나는 사소한 일에도 짜증이 난다.',
    '나는 스스로를 자책한다.',
    '나는 죽고 싶다는 생각이 들 때가 있다.',
    '나는 과거의 실수를 자주 떠올린다.',
    '나는 내 감정을 표현하기 어렵다.',
    '나는 자주 외로움을 느낀다.',
    '나는 감정이 무뎌진 것 같다.',
    '나는 걱정이 많고 쉽게 불안해진다.',
    '나는 자신을 돌보는 데 관심이 없다.',
    '나는 사교 활동을 피하려 한다.',
    '나는 미래를 생각하면 불안하다.',
    '나는 무기력한 느낌이 자주 든다.',
    '나는 어떤 일에도 흥미를 잃었다.',
    '나는 예전보다 더 쉽게 눈물이 난다.',
    '나는 아무도 나를 이해하지 못한다고 느낀다.',
    '나는 자주 자신을 비판한다.',
    '나는 다른 사람보다 항상 부족하다고 느낀다.',
    '나는 살면서 의미를 잃은 것 같다.',
  ];
  await prisma.surveyQuestion.createMany({
    data: questions.map((content, idx) => ({
      surveyTypeId: ipipDepression.id,
      ageGroup: 'all',
      order: idx + 1,
      content,
      isReverse: false,
    })),
  });

  // 4. 점수 해석 기준 생성
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: ipipDepression.id,
        minScore: 30,
        maxScore: 59,
        label: '우울 증상 없음 또는 매우 경미',
        description: '',
      },
      {
        surveyTypeId: ipipDepression.id,
        minScore: 60,
        maxScore: 89,
        label: '경미한 우울 경향',
        description: '',
      },
      {
        surveyTypeId: ipipDepression.id,
        minScore: 90,
        maxScore: 119,
        label: '중등도 우울',
        description: '',
      },
      {
        surveyTypeId: ipipDepression.id,
        minScore: 120,
        maxScore: 150,
        label: '심각한 우울 가능성',
        description: '',
      },
    ],
  });

  // 5. 카테고리(불안/긴장) upsert
  const anxiety = await prisma.surveyCategory.upsert({
    where: { code: 'anxiety' },
    update: {},
    create: { name: '불안/긴장', code: 'anxiety' },
  });

  // 6. IPIP Trait Anxiety Scale 설문타입 생성 (type: 'professional')
  const ipipAnxiety = await prisma.surveyType.upsert({
    where: { code: 'IPIP-ANX' },
    update: {},
    create: {
      code: 'IPIP-ANX',
      name: 'IPIP Trait Anxiety Scale',
      description: 'IPIP 기반 불안/긴장 전문 설문',
      categoryId: anxiety.id,
      type: 'professional',
    },
  });

  // 7. 30문항 생성 (ageGroup: 'all')
  const anxietyQuestions = [
    '나는 사소한 일에도 자주 걱정한다.',
    '나는 예기치 않은 상황이 생기면 쉽게 긴장한다.',
    '나는 낯선 사람들과 있을 때 불편함을 느낀다.',
    '나는 실수하는 것에 대해 지나치게 두려워한다.',
    '나는 누군가 나를 평가할 때 매우 불안하다.',
    '나는 시험이나 발표 전에 과도하게 긴장한다.',
    '나는 사람들 앞에서 말할 때 긴장된다.',
    '나는 불확실한 미래에 대해 걱정이 많다.',
    '나는 실망할까봐 새로운 것을 시도하지 않는다.',
    '나는 갑작스러운 소리에 매우 민감하다.',
    '나는 긴장할 때 몸이 떨리거나 땀이 난다.',
    '나는 사람들이 나를 이상하게 생각할까봐 걱정된다.',
    '나는 남들에게 나쁜 인상을 줄까봐 걱정이 된다.',
    '나는 자주 긴장감으로 인해 집중이 어렵다.',
    '나는 걱정을 멈추는 것이 어렵다.',
    '나는 자주 심장이 두근거리거나 숨이 가쁘다.',
    '나는 자주 일어날 수 없는 일들에 대해 걱정한다.',
    '나는 스트레스를 받으면 위장에 문제가 생긴다.',
    '나는 실수한 일에 대해 오래 후회한다.',
    '나는 대인관계에서 거절당할까봐 불안하다.',
    '나는 자주 이유 없이 초조함을 느낀다.',
    '나는 불안을 숨기기 위해 애쓴다.',
    '나는 부정적인 결과를 계속 상상하게 된다.',
    '나는 일을 시작하기 전에 과도한 걱정을 한다.',
    '나는 실망할까봐 기대하지 않으려 한다.',
    '나는 계획이 틀어질까봐 늘 긴장한다.',
    '나는 다른 사람보다 더 자주 불안함을 느낀다.',
    '나는 실망시킬까봐 타인을 피하기도 한다.',
    '나는 긴장 때문에 잠을 잘 못 자는 날이 많다.',
    '나는 아무 일 없는데도 불안할 때가 있다.',
  ];
  await prisma.surveyQuestion.createMany({
    data: anxietyQuestions.map((content, idx) => ({
      surveyTypeId: ipipAnxiety.id,
      ageGroup: 'all',
      order: idx + 1,
      content,
      isReverse: false,
    })),
  });

  // 8. 점수 해석 기준 생성
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: ipipAnxiety.id,
        minScore: 30,
        maxScore: 59,
        label: '불안 수준 없음 또는 매우 낮음',
        description: '',
      },
      {
        surveyTypeId: ipipAnxiety.id,
        minScore: 60,
        maxScore: 89,
        label: '경미한 불안 경향',
        description: '',
      },
      {
        surveyTypeId: ipipAnxiety.id,
        minScore: 90,
        maxScore: 119,
        label: '중등도 불안',
        description: '',
      },
      {
        surveyTypeId: ipipAnxiety.id,
        minScore: 120,
        maxScore: 150,
        label: '고도 불안 – 지속적인 긴장 및 걱정 가능성',
        description: '',
      },
    ],
  });

  // 9. 카테고리(대인관계/소통어려움) upsert
  const relationship = await prisma.surveyCategory.upsert({
    where: { code: 'relationship' },
    update: {},
    create: { name: '대인관계/소통어려움', code: 'relationship' },
  });

  // 10. IPIP Assertiveness Scale 설문타입 생성 (type: 'professional')
  const ipipAssertiveness = await prisma.surveyType.upsert({
    where: { code: 'IPIP-ASS' },
    update: {},
    create: {
      code: 'IPIP-ASS',
      name: 'IPIP Assertiveness Scale',
      description: 'IPIP 기반 대인관계/소통 자기주장성 전문 설문',
      categoryId: relationship.id,
      type: 'professional',
    },
  });

  // 11. 30문항 생성 (ageGroup: 'all')
  const assertivenessQuestions = [
    '나는 사람들 앞에서 나의 의견을 분명히 말한다.',
    '나는 새로운 사람에게 쉽게 다가간다.',
    '나는 나에게 부당한 대우를 받으면 바로 말한다.',
    '나는 회의나 모임에서 내 생각을 표현한다.',
    '나는 비판을 받아도 감정적으로 무너지지 않는다.',
    '나는 부탁을 거절하는 것이 어렵지 않다.',
    '나는 갈등 상황에서 내 입장을 분명히 한다.',
    '나는 타인과의 논쟁을 회피하지 않는다.',
    '나는 내 감정을 숨기지 않고 표현하는 편이다.',
    '나는 내 권리를 지키기 위해 목소리를 낸다.',
    '나는 누군가의 요구가 불합리하면 거절할 수 있다.',
    '나는 타인과 동등하게 관계를 맺으려 한다.',
    '나는 내 감정과 생각을 솔직하게 표현한다.',
    '나는 지시를 받는 것보다 주도적으로 행동하고 싶다.',
    '나는 문제 상황에서 대화를 주도하는 편이다.',
    '나는 어려운 주제도 회피하지 않고 이야기한다.',
    '나는 다른 사람들의 기분만을 지나치게 고려하지 않는다.',
    '나는 내 결정에 대해 확신을 가지고 말한다.',
    '나는 타인의 평가보다 나의 신념을 중요하게 여긴다.',
    '나는 타인과 의견이 다를 때 불편함을 느끼지 않는다.',
    '나는 필요하다면 감정을 강하게 표현하기도 한다.',
    '나는 내 권리나 필요를 정중하게 주장할 수 있다.',
    '나는 불편한 요청을 단호히 거절할 수 있다.',
    '나는 사소한 문제라도 내 생각을 분명히 밝힌다.',
    '나는 관계 속에서 나를 희생하지 않으려 노력한다.',
    '나는 대화 중 상대에게 주도권을 빼앗기지 않는다.',
    '나는 비판을 피하려고 내 생각을 숨기지 않는다.',
    '나는 누군가가 불합리한 요청을 하면 정중히 거절한다.',
    '나는 내 목소리를 내는 것을 두려워하지 않는다.',
    '나는 내가 원하는 바를 명확히 전달할 수 있다.',
  ];
  await prisma.surveyQuestion.createMany({
    data: assertivenessQuestions.map((content, idx) => ({
      surveyTypeId: ipipAssertiveness.id,
      ageGroup: 'all',
      order: idx + 1,
      content,
      isReverse: false,
    })),
  });

  // 12. 점수 해석 기준 생성
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: ipipAssertiveness.id,
        minScore: 30,
        maxScore: 59,
        label: '매우 소극적 / 대인관계 회피형',
        description: '',
      },
      {
        surveyTypeId: ipipAssertiveness.id,
        minScore: 60,
        maxScore: 89,
        label: '소극적인 편이나 평균 범주',
        description: '',
      },
      {
        surveyTypeId: ipipAssertiveness.id,
        minScore: 90,
        maxScore: 119,
        label: '평균적인 자기주장성',
        description: '',
      },
      {
        surveyTypeId: ipipAssertiveness.id,
        minScore: 120,
        maxScore: 150,
        label: '높은 자기주장성 / 사회적 자신감 높음',
        description: '',
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
