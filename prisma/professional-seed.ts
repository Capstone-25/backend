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

  // 13. 카테고리(진로/미래불안) upsert
  const future = await prisma.surveyCategory.upsert({
    where: { code: 'future' },
    update: {},
    create: { name: '진로/미래불안', code: 'future' },
  });

  // 14. Locus of Control Scale 설문타입 생성 (type: 'professional')
  const locusOfControl = await prisma.surveyType.upsert({
    where: { code: 'LOCUS-CTRL' },
    update: {},
    create: {
      code: 'LOCUS-CTRL',
      name: 'IPIP Locus of Control Scale',
      description: 'IPIP 기반 진로/미래불안 통제감 전문 설문',
      categoryId: future.id,
      type: 'professional',
    },
  });

  // 15. 45문항 생성 (ageGroup: 'all')
  const locusQuestions = [
    '나는 대부분의 일이 내 노력에 따라 달라진다고 생각한다.',
    '내가 실패하면, 내 잘못이 가장 크다고 본다.',
    '사람들은 운이 좋아서 성공하는 것이 아니다.',
    '내 인생은 내가 만드는 것이다.',
    '나는 환경보다 나 자신을 믿는다.',
    '좋은 기회는 기다리기보다 만들어야 한다고 믿는다.',
    '노력은 결국 보상받는다고 생각한다.',
    '나는 현실이 바뀌길 바라기보다 스스로 바꾸려 한다.',
    '책임은 남이 아닌 나에게 있다고 느낀다.',
    '외부 요인보다 내 결정을 더 신뢰한다.',
    '사람들은 결과를 환경 탓으로 돌리는 경향이 있다.',
    '어떤 일이 잘 풀리면 내 준비 덕분이라고 생각한다.',
    '나는 삶의 주도권을 스스로 갖고 있다고 느낀다.',
    '나의 미래는 내가 결정한다고 믿는다.',
    '어려움은 내 성장에 달려있다고 본다.',
    '나는 자신의 한계를 스스로 정하지 않는다.',
    '어떤 선택이든 결과는 내 몫이다.',
    '상황이 어렵더라도 나는 극복할 수 있다고 생각한다.',
    '결과를 바꾸기 위해 행동하는 편이다.',
    '계획을 세우면 대부분 이뤄낸다.',
    '나는 내 인생을 조종할 수 있다.',
    '운에 의존하지 않으려 한다.',
    '피할 수 없다면 내가 변해야 한다고 생각한다.',
    '나는 실패를 배우는 기회로 본다.',
    '어려운 결정도 직접 내리는 편이다.',
    '내 감정도 내가 통제할 수 있다고 믿는다.',
    '삶의 방향은 내가 정한다.',
    '나는 목표를 향해 계획적으로 움직인다.',
    '내가 할 수 있는 일에 집중한다.',
    '나는 남들이 뭐라 하든 내 길을 간다.',
    '결과에 책임질 준비가 되어 있다.',
    '나는 내 선택에 후회하지 않는다.',
    '문제가 생기면 내가 먼저 해결하려 한다.',
    '나는 나의 삶에 주인이라는 생각이 강하다.',
    '계획한 대로 일이 되지 않아도 포기하지 않는다.',
    '다른 사람의 기대보다 나의 가치관을 따르는 편이다.',
    '운보다 습관이 더 중요하다고 생각한다.',
    '나는 미래에 대한 책임감을 느낀다.',
    '잘못되었을 때 핑계를 대지 않으려 한다.',
    '자기 효능감을 높이기 위해 노력한다.',
    '나는 반복되는 실패를 통해 배우려 한다.',
    '실수를 남 탓으로 돌리지 않는다.',
    '삶의 통제력을 키우기 위해 공부하고 훈련한다.',
    '상황이 안 좋아도 방향을 스스로 바꾸려 한다.',
    '내가 인생을 어떻게 살아가는지에 따라 모든 게 달라진다.',
  ];
  await prisma.surveyQuestion.createMany({
    data: locusQuestions.map((content, idx) => ({
      surveyTypeId: locusOfControl.id,
      ageGroup: 'all',
      order: idx + 1,
      content,
      isReverse: false,
    })),
  });

  // 16. 점수 해석 기준 생성
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: locusOfControl.id,
        minScore: 45,
        maxScore: 99,
        label: '외재적 통제 중심 (운, 타인의 영향 강조)',
        description: '',
      },
      {
        surveyTypeId: locusOfControl.id,
        minScore: 100,
        maxScore: 169,
        label: '중간 통제 감각 (상황에 따라 다름)',
        description: '',
      },
      {
        surveyTypeId: locusOfControl.id,
        minScore: 170,
        maxScore: 225,
        label: '내재적 통제 중심 (자신의 노력과 선택 강조)',
        description: '',
      },
    ],
  });

  // 17. 카테고리(학업/성적 스트레스) upsert
  const academic = await prisma.surveyCategory.upsert({
    where: { code: 'academic' },
    update: {},
    create: { name: '학업/성적 스트레스', code: 'academic' },
  });

  // 18. Academic Stress Scale 설문타입 생성 (type: 'professional')
  const ass = await prisma.surveyType.upsert({
    where: { code: 'ASS' },
    update: {},
    create: {
      code: 'ASS',
      name: 'Academic Stress Scale',
      description: '학업/성적 스트레스 전문 설문',
      categoryId: academic.id,
      type: 'professional',
    },
  });

  // 19. 34문항 생성 (ageGroup: 'all')
  const assQuestions = [
    '시험이 다가오면 가슴이 두근거리고 불안해진다.',
    '학업 수행이 내 미래를 결정한다고 생각해서 부담된다.',
    '공부 양이 너무 많아 무엇부터 시작해야 할지 모르겠다.',
    '과제를 마감 시간 안에 끝내는 것이 스트레스를 준다.',
    '성적이 떨어질까 봐 항상 긴장한다.',
    '공부에 집중이 잘 안 된다.',
    '성적 때문에 부모님의 기대에 부응하지 못할까 걱정된다.',
    '내 친구들과 나를 비교하면서 불안해진다.',
    '새로운 과목이나 수업에 대한 두려움이 있다.',
    '수업 내용을 이해하지 못할까봐 걱정된다.',
    '시험이 끝나도 스트레스가 가시지 않는다.',
    '아침에 눈을 뜨면 학업 걱정이 먼저 든다.',
    '실수를 하면 스스로를 비난하게 된다.',
    '경쟁적인 분위기가 부담스럽다.',
    '하루에 공부할 시간이 부족하다고 느낀다.',
    '시험이 가까워지면 수면 시간이 줄어든다.',
    '공부할 생각만 해도 지친다.',
    '공부에 대한 압박으로 다른 활동에 집중하기 어렵다.',
    '성적표를 받을 때마다 긴장된다.',
    '성취도가 낮으면 내 자신이 가치 없어 보인다.',
    '공부하지 않으면 불안하다.',
    '내 학업 능력이 다른 사람보다 뒤처진다고 느낀다.',
    '평소보다 시험 기간에 감정 기복이 심해진다.',
    '스스로 계획한 공부량을 지키지 못할 때 좌절한다.',
    '시험 준비 중에 소화가 잘 안 된다.',
    '친구들이 더 잘할까봐 신경이 쓰인다.',
    '선생님의 평가나 피드백이 스트레스로 느껴진다.',
    '공부 외에 다른 활동을 하면 죄책감이 든다.',
    '성적에 따라 내 가치를 판단하게 된다.',
    '공부를 하지 않아도 항상 불안하다.',
    '시간 관리에 어려움을 느낀다.',
    '성적이 나쁘면 미래가 불안하게 느껴진다.',
    '부모님과 성적에 대해 이야기하는 것이 스트레스를 준다.',
    '공부를 많이 해도 결과가 좋지 않을까 걱정된다.',
  ];
  await prisma.surveyQuestion.createMany({
    data: assQuestions.map((content, idx) => ({
      surveyTypeId: ass.id,
      ageGroup: 'all',
      order: idx + 1,
      content,
      isReverse: false,
    })),
  });

  // 20. 점수 해석 기준 생성
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: ass.id,
        minScore: 34,
        maxScore: 79,
        label: '스트레스 수준 낮음',
        description: '',
      },
      {
        surveyTypeId: ass.id,
        minScore: 80,
        maxScore: 124,
        label: '중간 수준 스트레스',
        description: '',
      },
      {
        surveyTypeId: ass.id,
        minScore: 125,
        maxScore: 170,
        label: '높은 학업 스트레스',
        description: '',
      },
    ],
  });

  // 21. 카테고리(직장/업무 스트레스) upsert
  const work = await prisma.surveyCategory.upsert({
    where: { code: 'work' },
    update: {},
    create: { name: '직장/업무 스트레스', code: 'work' },
  });

  // 22. Occupational Stress Index 설문타입 생성 (type: 'professional')
  const osi = await prisma.surveyType.upsert({
    where: { code: 'OSI' },
    update: {},
    create: {
      code: 'OSI',
      name: 'Occupational Stress Index',
      description: '직장/업무 스트레스 전문 설문',
      categoryId: work.id,
      type: 'professional',
    },
  });

  // 23. 46문항 생성 (ageGroup: 'all', 역문항 반영)
  const osiQuestions = [
    {
      order: 1,
      content: '나는 이 직장에서 많은 일을 해야 한다.',
      isReverse: false,
    },
    {
      order: 2,
      content: '내 직무 역할과 그 결과에 관한 정보가 모호하고 불충분하다.',
      isReverse: true,
    },
    {
      order: 3,
      content: '상사들이 내 업무에 대해 상반된 지시를 내리는 경우가 많다.',
      isReverse: true,
    },
    {
      order: 4,
      content:
        '정치적/집단적 압력과 공식적인 규칙 및 지시 사이에서 조율하는 것이 어렵다.',
      isReverse: true,
    },
    {
      order: 5,
      content: '많은 직원들의 효율성과 생산성에 대한 책임이 내게 주어진다.',
      isReverse: false,
    },
    {
      order: 6,
      content: '내 제안 대부분이 존중되고 실행된다.',
      isReverse: false,
    },
    {
      order: 7,
      content: '내가 지시한 업무 배분이 제대로 이행된다.',
      isReverse: false,
    },
    {
      order: 8,
      content: '나는 좋아하는 사람들과 함께 일한다.',
      isReverse: false,
    },
    { order: 9, content: '내 업무는 단조롭다.', isReverse: true },
    {
      order: 10,
      content: '상사들이 내 자존심을 존중해준다.',
      isReverse: false,
    },
    { order: 11, content: '내 노동량에 비해 급여가 적다.', isReverse: true },
    { order: 12, content: '나는 긴장된 환경에서 일한다.', isReverse: true },
    { order: 13, content: '나는 업무량이 과도하다고 느낀다.', isReverse: true },
    {
      order: 14,
      content: '내 직무에 대한 기대가 명확하지 않다.',
      isReverse: true,
    },
    { order: 15, content: '상사들의 지시가 일관되지 않다.', isReverse: true },
    { order: 16, content: '나는 정치적 압력에 시달린다.', isReverse: true },
    {
      order: 17,
      content: '다른 사람들의 효율성과 생산성에 대한 책임이 내게 주어진다.',
      isReverse: false,
    },
    {
      order: 18,
      content: '나는 중요한 결정에 참여하지 못한다.',
      isReverse: true,
    },
    {
      order: 19,
      content: '나는 내 업무에 대한 통제력이 부족하다.',
      isReverse: true,
    },
    { order: 20, content: '동료들과의 관계가 원만하지 않다.', isReverse: true },
    {
      order: 21,
      content: '내 업무는 창의성이 요구되지 않는다.',
      isReverse: true,
    },
    {
      order: 22,
      content: '나는 조직 내에서 낮은 지위를 가지고 있다.',
      isReverse: true,
    },
    { order: 23, content: '내 업무는 보상이 충분하지 않다.', isReverse: true },
    {
      order: 24,
      content: '나는 열악한 근무 조건에서 일한다.',
      isReverse: true,
    },
    {
      order: 25,
      content: '나는 업무량이 많아 스트레스를 느낀다.',
      isReverse: false,
    },
    {
      order: 26,
      content: '내 역할에 대한 기대가 불명확하다.',
      isReverse: true,
    },
    { order: 27, content: '상사들의 지시가 서로 충돌한다.', isReverse: true },
    { order: 28, content: '나는 부당한 압력을 받는다.', isReverse: true },
    {
      order: 29,
      content: '나는 다른 사람들의 성과에 대해 책임이 있다.',
      isReverse: false,
    },
    {
      order: 30,
      content: '나는 의사 결정 과정에 참여하지 못한다.',
      isReverse: true,
    },
    {
      order: 31,
      content: '나는 내 업무에 대한 통제력이 없다.',
      isReverse: false,
    },
    { order: 32, content: '동료들과의 관계가 좋지 않다.', isReverse: true },
    { order: 33, content: '내 업무는 도전적이지 않다.', isReverse: false },
    {
      order: 34,
      content: '나는 조직 내에서 인정받지 못한다.',
      isReverse: true,
    },
    { order: 35, content: '나는 열악한 환경에서 일한다.', isReverse: false },
    {
      order: 36,
      content: '나는 업무량이 과도하다고 느낀다.',
      isReverse: false,
    },
    { order: 37, content: '내 직무에 대한 정보가 부족하다.', isReverse: true },
    { order: 38, content: '상사들의 지시가 일관되지 않다.', isReverse: false },
    { order: 39, content: '나는 정치적 압력에 시달린다.', isReverse: true },
    {
      order: 40,
      content: '나는 중요한 결정에 참여하지 못한다.',
      isReverse: false,
    },
    { order: 41, content: '동료들과의 관계가 원만하지 않다.', isReverse: true },
    {
      order: 42,
      content: '내 업무는 창의성이 요구되지 않는다.',
      isReverse: false,
    },
    {
      order: 43,
      content: '나는 열악한 근무 조건에서 일한다.',
      isReverse: true,
    },
    {
      order: 44,
      content: '나는 업무량이 많아 스트레스를 느낀다.',
      isReverse: false,
    },
    { order: 45, content: '상사들의 지시가 서로 충돌한다.', isReverse: true },
    {
      order: 46,
      content: '나는 이 직장에서 많은 일을 해야 한다.',
      isReverse: false,
    },
  ];
  await prisma.surveyQuestion.createMany({
    data: osiQuestions.map(q => ({
      surveyTypeId: osi.id,
      ageGroup: 'all',
      order: q.order,
      content: q.content,
      isReverse: q.isReverse,
    })),
  });

  // 24. 점수 해석 기준 생성
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: osi.id,
        minScore: 46,
        maxScore: 122,
        label: '낮은 스트레스 수준',
        description: '',
      },
      {
        surveyTypeId: osi.id,
        minScore: 123,
        maxScore: 155,
        label: '중간 스트레스 수준',
        description: '',
      },
      {
        surveyTypeId: osi.id,
        minScore: 156,
        maxScore: 230,
        label: '높은 스트레스 수준',
        description: '',
      },
    ],
  });

  // 25. 카테고리(가족관계) upsert
  const family = await prisma.surveyCategory.upsert({
    where: { code: 'family' },
    update: {},
    create: { name: '가족문제', code: 'family' },
  });

  // 26. IPIP Family Relations Scale 설문타입 생성 (type: 'professional')
  const familyRelations = await prisma.surveyType.upsert({
    where: { code: 'IPIP-FAM' },
    update: {},
    create: {
      code: 'IPIP-FAM',
      name: 'IPIP Family Relations Scale',
      description: 'IPIP 기반 가족관계 전문 설문',
      categoryId: family.id,
      type: 'professional',
    },
  });

  // 27. 36문항 생성 (ageGroup: 'all')
  const familyQuestions = [
    '우리 가족은 서로를 신뢰한다.',
    '가족 구성원들은 서로의 의견을 존중한다.',
    '가족 내에서 감정을 자유롭게 표현할 수 있다.',
    '가족 구성원들은 서로의 성취를 축하한다.',
    '가족은 어려운 시기에 서로를 지지한다.',
    '가족 내 갈등은 건설적으로 해결된다.',
    '가족 구성원들은 서로의 사생활을 존중한다.',
    '가족은 함께 시간을 보내는 것을 중요하게 생각한다.',
    '가족 구성원들은 서로의 관심사에 관심을 가진다.',
    '가족 내에서 결정은 공동으로 이루어진다.',
    '가족 구성원들은 서로에게 감사를 표현한다.',
    '가족은 전통과 가치를 공유한다.',
    '가족 구성원들은 서로의 차이를 수용한다.',
    '가족 내에서 유머와 웃음이 자주 있다.',
    '가족 구성원들은 서로의 필요를 이해하려 노력한다.',
    '가족은 정기적으로 함께 식사한다.',
    '가족 구성원들은 서로의 친구를 환영한다.',
    '가족 내에서 비판은 건설적으로 이루어진다.',
    '가족 구성원들은 서로의 경계를 존중한다.',
    '가족은 공동의 목표를 가지고 있다.',
    '가족 구성원들은 서로의 감정을 인정한다.',
    '가족 내에서 책임은 공평하게 분담된다.',
    '가족 구성원들은 서로를 격려한다.',
    '가족은 변화에 유연하게 대응한다.',
    '가족 구성원들은 서로의 시간을 존중한다.',
    '가족 내에서 의견 차이는 존중된다.',
    '가족 구성원들은 서로의 성장을 지원한다.',
    '가족은 공동의 활동을 즐긴다.',
    '가족 구성원들은 서로에게 솔직하다.',
    '가족 내에서 갈등은 피하지 않고 해결된다.',
    '가족 구성원들은 서로의 선택을 지지한다.',
    '가족은 서로의 전통을 존중한다.',
    '가족 구성원들은 서로에게 시간을 할애한다.',
    '가족 내에서 기대는 명확하게 전달된다.',
    '가족 구성원들은 서로의 감정을 고려한다.',
    '가족은 함께 미래를 계획한다.',
  ];
  await prisma.surveyQuestion.createMany({
    data: familyQuestions.map((content, idx) => ({
      surveyTypeId: familyRelations.id,
      ageGroup: 'all',
      order: idx + 1,
      content,
      isReverse: false,
    })),
  });

  // 28. 점수 해석 기준 생성
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: familyRelations.id,
        minScore: 0,
        maxScore: 71,
        label: '가족 기능에 심각한 문제가 있음',
        description: '',
      },
      {
        surveyTypeId: familyRelations.id,
        minScore: 72,
        maxScore: 107,
        label: '가족 기능에 일부 문제가 있음',
        description: '',
      },
      {
        surveyTypeId: familyRelations.id,
        minScore: 108,
        maxScore: 143,
        label: '가족 기능이 양호함',
        description: '',
      },
      {
        surveyTypeId: familyRelations.id,
        minScore: 144,
        maxScore: 180,
        label: '가족 기능이 매우 건강함',
        description: '',
      },
    ],
  });

  // 29. 카테고리(애착) upsert
  const attachment = await prisma.surveyCategory.upsert({
    where: { code: 'attachment' },
    update: {},
    create: { name: '애착', code: 'attachment' },
  });

  // 30. ASQ-SF 설문타입 생성 (type: 'professional')
  const asqsf = await prisma.surveyType.upsert({
    where: { code: 'ASQ-SF' },
    update: {},
    create: {
      code: 'ASQ-SF',
      name: 'ASQ-SF (Adult Attachment Scale Short Form)',
      description: '애착 불안/회피 전문 설문',
      categoryId: attachment.id,
      type: 'professional',
    },
  });

  // 31. 40문항 생성 (ageGroup: 'all')
  const asqQuestions = [
    // 1~20: 애착 불안
    '나는 가까운 사람에게 나를 얼마나 좋아하는지 자주 확인받고 싶다.',
    '관계에서 무시당하거나 거절당할까봐 자주 걱정된다.',
    '나는 친한 사람에게 집착하는 경향이 있다.',
    '혼자 있을 때 불안감이 든다.',
    '누군가가 나를 떠날까봐 자주 불안하다.',
    '나는 감정적으로 다른 사람에게 의존하는 편이다.',
    '나에게 중요한 사람이 다른 사람과 가까워지면 질투가 난다.',
    '나는 감정 기복이 심하고, 감정적 안정감을 원한다.',
    '나는 연인이 나를 충분히 사랑하는지 자주 의심한다.',
    '가까운 사람이 내 연락에 응답이 느리면 불안하다.',
    '나는 내가 사랑받을 가치가 있는지 자주 의심한다.',
    '나는 거절당할까봐 내 감정을 숨긴다.',
    '나는 중요한 사람과 떨어져 있으면 심한 불안감을 느낀다.',
    '나는 연애에서 항상 더 많은 애정을 요구한다.',
    '나는 혼자 있는 것보다 누군가 곁에 있어야 편하다.',
    '나는 가까운 사람이 나를 버릴까봐 걱정한다.',
    '상대방이 나를 어떻게 생각하는지 항상 신경 쓴다.',
    '나에게 관심이 부족하다고 느끼면 금방 불안해진다.',
    '상대방이 나를 좋아하지 않는 것처럼 느껴지면 깊이 상처받는다.',
    '나는 관계에서 항상 확신을 원한다.',
    // 21~40: 애착 회피
    '나는 감정을 다른 사람에게 표현하는 것이 불편하다.',
    '나는 독립적인 것이 더 편하고 안정감을 준다.',
    '나는 감정적으로 가까운 관계를 피하려는 경향이 있다.',
    '연애에서 의존은 약점이라고 느낀다.',
    '누군가가 정서적으로 너무 가까워지면 거리를 두고 싶어진다.',
    '나는 감정 표현이 많은 사람이 부담스럽다.',
    '나는 가까운 관계에서 감정적으로 거리를 두려고 한다.',
    '나는 문제를 혼자 해결하고 싶어한다.',
    '연인에게 약한 모습을 보이고 싶지 않다.',
    '나는 감정적으로 깊은 대화를 피하는 편이다.',
    '나는 사람들과 너무 자주 소통하면 지친다.',
    '관계를 오래 유지하는 것보다 혼자가 편하다고 느낄 때가 많다.',
    '누군가에게 의지하는 것이 두렵다.',
    '나는 가까운 관계에서 자유롭지 못한 느낌이 들면 회피한다.',
    '나는 내 감정을 숨기는 편이다.',
    '나는 사람들과 너무 정서적으로 얽히는 것이 불편하다.',
    '나는 연애에서 감정적 거리를 유지하려고 노력한다.',
    '감정적으로 기대는 것보다 독립을 중시한다.',
    '누군가와 너무 가까워지면 부담스럽고 숨이 막히는 느낌이 든다.',
    '나는 누군가와 깊은 유대감을 맺는 것이 어려운 편이다.',
  ];
  await prisma.surveyQuestion.createMany({
    data: asqQuestions.map((content, idx) => ({
      surveyTypeId: asqsf.id,
      ageGroup: 'all',
      order: idx + 1,
      content,
      isReverse: false,
    })),
  });

  // 32. 점수 해석 기준 생성 (불안/회피 각각 3구간, description으로 구분)
  await prisma.surveyResult.createMany({
    data: [
      // 불안 점수
      {
        surveyTypeId: asqsf.id,
        minScore: 1.0,
        maxScore: 2.5,
        label: '낮은 수준 (안정 애착)',
        description: '불안 점수',
      },
      {
        surveyTypeId: asqsf.id,
        minScore: 2.6,
        maxScore: 4.0,
        label: '중간 수준 (혼재된 양상)',
        description: '불안 점수',
      },
      {
        surveyTypeId: asqsf.id,
        minScore: 4.1,
        maxScore: 6.0,
        label: '높은 수준 (불안정 애착)',
        description: '불안 점수',
      },
      // 회피 점수
      {
        surveyTypeId: asqsf.id,
        minScore: 1.0,
        maxScore: 2.5,
        label: '낮은 수준 (안정 애착)',
        description: '회피 점수',
      },
      {
        surveyTypeId: asqsf.id,
        minScore: 2.6,
        maxScore: 4.0,
        label: '중간 수준 (혼재된 양상)',
        description: '회피 점수',
      },
      {
        surveyTypeId: asqsf.id,
        minScore: 4.1,
        maxScore: 6.0,
        label: '높은 수준 (불안정 애착)',
        description: '회피 점수',
      },
    ],
  });

  // 33. 카테고리(성격/빅5) upsert
  const big5 = await prisma.surveyCategory.upsert({
    where: { code: 'big5' },
    update: {},
    create: { name: '성격(빅5)', code: 'big5' },
  });

  // 34. IPIP-NEO-60 설문타입 생성 (type: 'professional')
  const ipipNeo = await prisma.surveyType.upsert({
    where: { code: 'IPIP-NEO-60' },
    update: {},
    create: {
      code: 'IPIP-NEO-60',
      name: 'IPIP-NEO-60 (Big Five Personality)',
      description: '국제 성격 5요인 60문항',
      categoryId: big5.id,
      type: 'professional',
    },
  });

  // 35. 60문항 생성 (isReverse 반영)
  const ipipNeoQuestions = [
    // 외향성(1~12)
    { content: '나는 사람들과 어울리는 것을 좋아한다.', isReverse: false },
    { content: '나는 사교적인 활동을 즐긴다.', isReverse: false },
    {
      content: '나는 낯선 사람들과도 쉽게 이야기할 수 있다.',
      isReverse: false,
    },
    { content: '나는 파티에 가는 것이 즐겁다.', isReverse: false },
    { content: '나는 활기차고 에너지가 넘친다.', isReverse: false },
    { content: '나는 주목받는 것을 좋아한다.', isReverse: false },
    { content: '나는 모임에서 대화를 주도하는 편이다.', isReverse: false },
    { content: '나는 새로운 관계를 쉽게 만든다.', isReverse: false },
    { content: '나는 조용한 편이다.', isReverse: true },
    { content: '나는 혼자 있는 것을 즐긴다.', isReverse: true },
    { content: '나는 내성적인 성향이 강하다.', isReverse: true },
    { content: '나는 사람 많은 곳에서 에너지를 소모한다.', isReverse: true },
    // 친화성(13~24)
    { content: '나는 다른 사람들의 감정을 고려하는 편이다.', isReverse: false },
    { content: '나는 친절하고 배려심이 많다.', isReverse: false },
    { content: '나는 다른 사람의 입장을 이해하려 한다.', isReverse: false },
    { content: '나는 협력을 중요하게 생각한다.', isReverse: false },
    { content: '나는 남을 도우려고 한다.', isReverse: false },
    { content: '나는 쉽게 용서한다.', isReverse: false },
    { content: '나는 다정다감한 편이다.', isReverse: false },
    { content: '나는 신뢰할 수 있는 사람이다.', isReverse: false },
    { content: '나는 때때로 냉소적이거나 의심이 많다.', isReverse: true },
    { content: '나는 다른 사람의 단점을 자주 지적한다.', isReverse: true },
    {
      content: '나는 경쟁심이 강해 다른 사람을 이기고 싶어한다.',
      isReverse: true,
    },
    { content: '나는 다른 사람을 쉽게 비판한다.', isReverse: true },
    // 성실성(25~36)
    { content: '나는 정리정돈을 잘한다.', isReverse: false },
    { content: '나는 책임감이 강하다.', isReverse: false },
    { content: '나는 일정을 잘 지킨다.', isReverse: false },
    { content: '나는 체계적으로 일하는 것을 좋아한다.', isReverse: false },
    { content: '나는 목표를 세우고 실천한다.', isReverse: false },
    { content: '나는 규칙을 따르려 한다.', isReverse: false },
    { content: '나는 쉽게 집중한다.', isReverse: false },
    { content: '나는 끝까지 일을 마무리한다.', isReverse: false },
    { content: '나는 충동적으로 행동할 때가 있다.', isReverse: true },
    { content: '나는 때때로 일을 대충 한다.', isReverse: true },
    { content: '나는 자주 계획 없이 행동한다.', isReverse: true },
    { content: '나는 약속을 잘 어긴다.', isReverse: true },
    // 신경성(37~48)
    { content: '나는 자주 긴장하거나 불안해진다.', isReverse: false },
    { content: '나는 쉽게 상처받는다.', isReverse: false },
    { content: '나는 자주 스트레스를 느낀다.', isReverse: false },
    { content: '나는 사소한 일에도 걱정이 많다.', isReverse: false },
    { content: '나는 감정 기복이 심하다.', isReverse: false },
    { content: '나는 자주 우울한 기분이 든다.', isReverse: false },
    { content: '나는 자존감이 낮다고 느낀다.', isReverse: false },
    { content: '나는 쉽게 실망하거나 낙담한다.', isReverse: false },
    { content: '나는 안정감 있고 차분하다.', isReverse: true },
    { content: '나는 감정을 잘 통제한다.', isReverse: true },
    { content: '나는 위기 상황에서도 냉정하다.', isReverse: true },
    { content: '나는 잘 참는 편이다.', isReverse: true },
    // 개방성(49~60)
    { content: '나는 새로운 경험에 열린 편이다.', isReverse: false },
    { content: '나는 예술, 음악, 문학에 관심이 많다.', isReverse: false },
    { content: '나는 다양한 문화에 호기심이 많다.', isReverse: false },
    { content: '나는 상상력이 풍부하다.', isReverse: false },
    { content: '나는 창의적인 활동을 좋아한다.', isReverse: false },
    {
      content: '나는 새로운 아이디어를 탐구하는 것을 즐긴다.',
      isReverse: false,
    },
    {
      content: '나는 복잡한 개념을 이해하는 데 흥미를 느낀다.',
      isReverse: false,
    },
    { content: '나는 기존 방식보다 새로운 방법을 선호한다.', isReverse: false },
    { content: '나는 전통적이고 보수적인 편이다.', isReverse: true },
    { content: '나는 변화보다는 익숙한 것이 좋다.', isReverse: true },
    { content: '나는 철학적, 추상적 사고에 관심이 없다.', isReverse: true },
    {
      content: '나는 실험적이거나 모험적인 활동은 피하는 편이다.',
      isReverse: true,
    },
  ];
  await prisma.surveyQuestion.createMany({
    data: ipipNeoQuestions.map((q, idx) => ({
      surveyTypeId: ipipNeo.id,
      ageGroup: 'all',
      order: idx + 1,
      content: q.content,
      isReverse: q.isReverse,
    })),
  });

  // 36. 점수 해석 기준 (각 요인별 3구간)
  const big5Factors = [
    { name: '외향성', order: 1 },
    { name: '친화성', order: 2 },
    { name: '성실성', order: 3 },
    { name: '신경성', order: 4 },
    { name: '개방성', order: 5 },
  ];
  for (const [i, factor] of big5Factors.entries()) {
    await prisma.surveyResult.createMany({
      data: [
        {
          surveyTypeId: ipipNeo.id,
          minScore: 12,
          maxScore: 24,
          label: `${factor.name} 낮은 수준`,
          description: `${factor.name} (${i * 12 + 1}~${(i + 1) * 12}번)`,
        },
        {
          surveyTypeId: ipipNeo.id,
          minScore: 25,
          maxScore: 44,
          label: `${factor.name} 평균 수준`,
          description: `${factor.name} (${i * 12 + 1}~${(i + 1) * 12}번)`,
        },
        {
          surveyTypeId: ipipNeo.id,
          minScore: 45,
          maxScore: 60,
          label: `${factor.name} 높은 수준`,
          description: `${factor.name} (${i * 12 + 1}~${(i + 1) * 12}번)`,
        },
      ],
    });
  }

  // 37. 카테고리(건강행동) upsert
  const health = await prisma.surveyCategory.upsert({
    where: { code: 'health' },
    update: {},
    create: { name: '건강행동', code: 'health' },
  });

  // 38. HBC 설문타입 생성 (type: 'professional')
  const hbc = await prisma.surveyType.upsert({
    where: { code: 'HBC' },
    update: {},
    create: {
      code: 'HBC',
      name: 'Health Behavior Checklist',
      description: '건강행동 체크리스트(40문항)',
      categoryId: health.id,
      type: 'professional',
    },
  });

  // 39. 40문항 생성 (isReverse 반영)
  const hbcQuestions = [
    // 건강 습관(1~10)
    { content: '규칙적인 수면 시간을 지킨다.', isReverse: false },
    { content: '아침 식사를 거르지 않는다.', isReverse: false },
    { content: '규칙적으로 운동을 한다.', isReverse: false },
    { content: '채소나 과일을 자주 섭취한다.', isReverse: false },
    { content: '패스트푸드를 자주 먹는다.', isReverse: true },
    { content: '하루 8잔 이상 물을 마신다.', isReverse: false },
    { content: '충분한 수면을 취한다.', isReverse: false },
    { content: '정해진 시간에 식사한다.', isReverse: false },
    { content: '야식을 자주 먹는다.', isReverse: true },
    { content: '과식하지 않는다.', isReverse: false },
    // 예방 행동(11~20)
    { content: '정기적으로 건강검진을 받는다.', isReverse: false },
    { content: '손을 자주 씻는다.', isReverse: false },
    { content: '백신 접종을 제때 한다.', isReverse: false },
    { content: '필요시 마스크를 착용한다.', isReverse: false },
    { content: '양치질을 하루 2번 이상 한다.', isReverse: false },
    { content: '치과 검진을 정기적으로 받는다.', isReverse: false },
    { content: '감기나 질병이 있을 때 즉시 병원에 간다.', isReverse: false },
    { content: '질병 예방에 관심이 많다.', isReverse: false },
    { content: '위생 습관을 꾸준히 유지하려 한다.', isReverse: false },
    { content: '주변 위생 상태를 항상 확인한다.', isReverse: false },
    // 위험 행동(21~30, 모두 역문항)
    { content: '과음을 하는 편이다.', isReverse: true },
    { content: '흡연을 한다.', isReverse: true },
    { content: '불규칙한 생활을 한다.', isReverse: true },
    { content: '스트레스를 받을 때 폭식을 한다.', isReverse: true },
    { content: '약을 과용한 적이 있다.', isReverse: true },
    { content: '병원에 가는 걸 자주 미룬다.', isReverse: true },
    { content: '건강에 해로운 습관을 가지고 있다.', isReverse: true },
    {
      content: '스트레스 해소를 위해 해로운 방법을 사용한다.',
      isReverse: true,
    },
    { content: '불면을 경험해도 무시하고 넘긴다.', isReverse: true },
    { content: '몸이 아파도 쉬지 않고 일하거나 공부한다.', isReverse: true },
    // 사고 안전(31~40)
    { content: '교통 규칙을 잘 지킨다.', isReverse: false },
    { content: '보호 장비(헬멧 등)를 꼭 착용한다.', isReverse: false },
    { content: '위험한 행동을 피하려고 노력한다.', isReverse: false },
    { content: '밤길에 혼자 다니지 않는다.', isReverse: false },
    { content: '주의가 필요한 일을 할 때 항상 집중한다.', isReverse: false },
    { content: '차량 탑승 시 안전벨트를 꼭 착용한다.', isReverse: false },
    { content: '위험한 환경에서는 조심하려 한다.', isReverse: false },
    { content: '음주 후 운전을 절대 하지 않는다.', isReverse: false },
    {
      content: '위험한 상황에 대비한 행동을 미리 생각해둔다.',
      isReverse: false,
    },
    { content: '응급처치법을 알고 있다.', isReverse: false },
  ];
  await prisma.surveyQuestion.createMany({
    data: hbcQuestions.map((q, idx) => ({
      surveyTypeId: hbc.id,
      ageGroup: 'all',
      order: idx + 1,
      content: q.content,
      isReverse: q.isReverse,
    })),
  });

  // 40. 점수 해석 기준 생성 (4구간)
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: hbc.id,
        minScore: 170,
        maxScore: 200,
        label: '매우 건강함',
        description: '전반적인 생활습관이 건강하고 위험행동이 적음',
      },
      {
        surveyTypeId: hbc.id,
        minScore: 140,
        maxScore: 169,
        label: '평균 이상',
        description: '대체로 건강하지만 개선할 여지 있음',
      },
      {
        surveyTypeId: hbc.id,
        minScore: 110,
        maxScore: 139,
        label: '평균 이하',
        description: '불규칙하거나 위험한 습관이 다소 있음',
      },
      {
        surveyTypeId: hbc.id,
        minScore: 0,
        maxScore: 109,
        label: '건강 위험군',
        description: '건강을 해치는 행동이 다수 존재',
      },
    ],
  });

  // 41. 카테고리(해리/정체감) upsert
  const dissociation = await prisma.surveyCategory.upsert({
    where: { code: 'dissociation' },
    update: {},
    create: { name: '해리/정체감', code: 'dissociation' },
  });

  // 42. MID-60 설문타입 생성 (type: 'professional')
  const mid60 = await prisma.surveyType.upsert({
    where: { code: 'MID-60' },
    update: {},
    create: {
      code: 'MID-60',
      name: 'MID-60 (Multidimensional Inventory of Dissociation)',
      description: '해리성 경험 다차원 척도(60문항)',
      categoryId: dissociation.id,
      type: 'professional',
    },
  });

  // 43. 60문항 생성 (모두 isReverse: false)
  const mid60Questions = [
    `어떤 일이 있었는지 기억이 나지 않는 일이 종종 있다.`,
    `내가 직접 한 행동인데도 누가 했는지 모를 때가 있다.`,
    `내 몸이 내 것이 아닌 것처럼 느껴질 때가 있다.`,
    `내가 하는 행동을 밖에서 바라보는 것 같은 기분이 든다.`,
    `특정 순간에 현실이 아닌 것처럼 느껴진다.`,
    `특정 감정이 갑자기 사라지거나 잘 느껴지지 않는다.`,
    `내가 누구인지 헷갈릴 때가 있다.`,
    `내가 평소에 하지 않는 행동을 했는데 기억이 나지 않는다.`,
    `어떤 감정을 느끼기 전에 기억이 잘리지 않는 경우가 있다.`,
    `주변이 흐릿하게 보이거나 멀게 느껴진 적이 있다.`,
    `내가 마치 연극을 하는 것 같은 느낌이 든 적이 있다.`,
    `갑자기 다른 이름이나 나이로 느껴지는 순간이 있다.`,
    `사람들이 내가 했다는 일을 전혀 기억하지 못할 때가 있다.`,
    `어떤 상황에서 감정이 '꺼지는' 느낌이 들었다.`,
    `내 생각이 머리 속에서 울려 퍼지는 것처럼 들린다.`,
    `몸이 마치 마비된 듯한 느낌이 들 때가 있다.`,
    `누군가가 내 안에서 말을 거는 것 같은 느낌을 받는다.`,
    `내가 아닌 누군가가 내 안에 있는 것처럼 느껴질 때가 있다.`,
    `내가 누군가와 바뀐 것처럼 느껴질 때가 있다.`,
    `내 안에 여러 개의 인격이 있는 것처럼 느껴진다.`,
    `시간을 건너뛴 듯한 공백이 자주 있다.`,
    `중요한 정보를 잊어버리고, 나중에야 알게 될 때가 많다.`,
    `현실과 꿈이 헷갈릴 때가 있다.`,
    `말하려고 했던 내용을 갑자기 완전히 잊어버릴 때가 있다.`,
    `특정 상황에서 감정이 얼어붙은 것 같다.`,
    `분명 내가 경험한 일인데, 마치 남의 일처럼 느껴질 때가 있다.`,
    `대화 중 자신이 갑자기 바뀐 것 같은 경험이 있다.`,
    `다른 사람의 말이 멀리서 들리는 것 같을 때가 있다.`,
    `익숙한 장소가 낯설게 느껴질 때가 있다.`,
    `자신이 아닌 존재로 느껴질 때가 있다.`,
    `손발이 저릿하거나 감각이 사라지는 일이 자주 있다.`,
    `내가 지금 어디에 있는지 헷갈릴 때가 있다.`,
    `감정이 '꺼졌다가' 다시 돌아오는 것 같다.`,
    `사람들의 시선이 나를 통과해버리는 느낌이 있다.`,
    `누군가 내 행동을 조종하고 있다는 느낌이 있다.`,
    `가끔 내 몸이 내가 아닌 것 같다.`,
    `내가 왜 거기 있었는지 기억이 나지 않는 장소가 있다.`,
    `어릴 때 기억이 잘 나지 않는다.`,
    `하루 중 일부가 기억나지 않는 일이 자주 있다.`,
    `자신이 분열된 것 같은 느낌이 자주 있다.`,
    `감각이 현실처럼 느껴지지 않는 경우가 많다.`,
    `내가 실제로 존재하지 않는 것 같은 생각이 들 때가 있다.`,
    `어떤 순간, 나는 내가 아니라고 느낀다.`,
    `감정이 나와 분리된 것처럼 느껴진다.`,
    `내 목소리가 들리지 않거나, 다른 사람처럼 들릴 때가 있다.`,
    `손을 보면서도 이게 내 것 같지 않게 느껴질 때가 있다.`,
    `내가 멀리서 나를 바라보는 느낌이 자주 있다.`,
    `다른 사람의 경험을 내 것처럼 느낄 때가 있다.`,
    `내 행동을 통제하지 못하는 경우가 있다.`,
    `특정 소리나 냄새가 나를 과거로 데려간다.`,
    `익숙한 사람의 얼굴이 낯설게 느껴질 때가 있다.`,
    `말하려던 내용을 갑자기 잊고, 그 내용을 다시 떠올릴 수 없다.`,
    `대화를 나누고 있는데도, 내가 말한 기억이 없다.`,
    `내가 만든 결정이 나와 무관하게 느껴질 때가 있다.`,
    `순간적으로 자신이 사라지는 것 같은 느낌을 받는다.`,
    `내 안에서 다른 사람이 등장하는 느낌이 있다.`,
    `내가 방금 한 일을 전혀 기억하지 못한다.`,
    `감정이 내 것이 아닌 것처럼 느껴진다.`,
    `내가 누구인지 모를 때가 있다.`,
    `나의 일부가 독립적으로 행동하는 느낌이 든다.`,
  ];
  await prisma.surveyQuestion.createMany({
    data: mid60Questions.map((content, idx) => ({
      surveyTypeId: mid60.id,
      ageGroup: 'all',
      order: idx + 1,
      content,
      isReverse: false,
    })),
  });

  // 44. 점수 해석 기준 생성
  await prisma.surveyResult.createMany({
    data: [
      {
        surveyTypeId: mid60.id,
        minScore: 0,
        maxScore: 19,
        label: '정상',
        description: '해리 경험 없음',
      },
      {
        surveyTypeId: mid60.id,
        minScore: 20,
        maxScore: 39,
        label: '경도 해리',
        description: '해리 경험 적음',
      },
      {
        surveyTypeId: mid60.id,
        minScore: 40,
        maxScore: 59,
        label: '중등도 해리',
        description: '해리 경험 중등도',
      },
      {
        surveyTypeId: mid60.id,
        minScore: 60,
        maxScore: 60,
        label: '심각한 해리',
        description: '해리 경험 심각',
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
