import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. 카테고리 생성
  const depression = await prisma.surveyCategory.create({
    data: { name: '우울/무기력', code: 'depression' },
  });
  const anxiety = await prisma.surveyCategory.create({
    data: { name: '불안/긴장', code: 'anxiety' },
  });
  // ... (필요한 카테고리 추가)

  // 2. 검사 종류 생성
  const phq9 = await prisma.surveyType.create({
    data: {
      code: 'PHQ-9',
      name: '우울/무기력',
      description: '우울/무기력 평가',
      categoryId: depression.id,
    },
  });
  const gad7 = await prisma.surveyType.create({
    data: {
      code: 'GAD-7',
      name: '불안/긴장',
      description: '불안/긴장 평가',
      categoryId: anxiety.id,
    },
  });
  // ... (필요한 검사 추가)

  // 3. PHQ-9 문항 예시 (teen)
  await prisma.surveyQuestion.createMany({
    data: [
      {
        surveyTypeId: phq9.id,
        ageGroup: 'teen',
        order: 1,
        content: '흥미를 느끼거나 즐거움을 느끼는 일이 거의 없었다.',
        isReverse: false,
      },
      {
        surveyTypeId: phq9.id,
        ageGroup: 'teen',
        order: 2,
        content: '기분이 가라앉거나 우울하거나 절망적인 느낌이 들었다.',
        isReverse: false,
      },
      {
        surveyTypeId: phq9.id,
        ageGroup: 'teen',
        order: 3,
        content: '잠들기 어렵거나 자주 깼거나, 또는 너무 많이 잠을 잤다.',
        isReverse: false,
      },
      {
        surveyTypeId: phq9.id,
        ageGroup: 'teen',
        order: 4,
        content: '피로감이나 기운이 없었다.',
        isReverse: false,
      },
      {
        surveyTypeId: phq9.id,
        ageGroup: 'teen',
        order: 5,
        content: '식욕이 없거나 과식했다.',
        isReverse: false,
      },
      {
        surveyTypeId: phq9.id,
        ageGroup: 'teen',
        order: 6,
        content:
          '자신을 실패자라고 느꼈거나, 자신이나 가족을 실망시켰다고 생각했다.',
        isReverse: false,
      },
      {
        surveyTypeId: phq9.id,
        ageGroup: 'teen',
        order: 7,
        content: '집중하기 어려웠다 (예: 신문 읽기, TV 시청).',
        isReverse: false,
      },
      {
        surveyTypeId: phq9.id,
        ageGroup: 'teen',
        order: 8,
        content:
          '주변 사람이 알아챌 정도로 말이나 행동이 느려졌거나, 너무 안절부절못했다.',
        isReverse: false,
      },
      {
        surveyTypeId: phq9.id,
        ageGroup: 'teen',
        order: 9,
        content: '살아있는 것이 싫거나 자해 또는 죽음에 대해 생각했다.',
        isReverse: false,
      },
    ],
  });

  // 4. GAD-7 문항 예시 (teen)
  await prisma.surveyQuestion.createMany({
    data: [
      {
        surveyTypeId: gad7.id,
        ageGroup: 'teen',
        order: 1,
        content: '초조하거나 긴장된 느낌이 있었다.',
        isReverse: false,
      },
      {
        surveyTypeId: gad7.id,
        ageGroup: 'teen',
        order: 2,
        content: '걱정을 멈추거나 조절하기 어려웠다.',
        isReverse: false,
      },
      {
        surveyTypeId: gad7.id,
        ageGroup: 'teen',
        order: 3,
        content: '여러 가지 일들에 대해 지나치게 걱정했다.',
        isReverse: false,
      },
      {
        surveyTypeId: gad7.id,
        ageGroup: 'teen',
        order: 4,
        content: '긴장을 푸는 것이 어려웠다.',
        isReverse: false,
      },
      {
        surveyTypeId: gad7.id,
        ageGroup: 'teen',
        order: 5,
        content: '너무 안절부절못하거나 산만한 느낌이 들었다.',
        isReverse: false,
      },
      {
        surveyTypeId: gad7.id,
        ageGroup: 'teen',
        order: 6,
        content: '쉽게 짜증이 났다.',
        isReverse: false,
      },
      {
        surveyTypeId: gad7.id,
        ageGroup: 'teen',
        order: 7,
        content: '과도한 걱정 때문에 일상생활에 지장이 있었다.',
        isReverse: false,
      },
    ],
  });

  // ... (다른 검사 및 연령대 문항도 추가 가능)
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
