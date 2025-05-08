import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class SurveyService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. 내가 했던 전문 설문 전체 목록
  async getMyProfessionalSurveys(userId: number) {
    return this.prisma.userSurvey.findMany({
      where: {
        userId,
        surveyType: { type: 'professional' },
      },
      include: {
        surveyType: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 2. 특정 설문 결과 상세
  async getProfessionalSurveyDetail(userId: number, userSurveyId: number) {
    const userSurvey = await this.prisma.userSurvey.findUnique({
      where: { id: userSurveyId },
      include: { surveyType: true },
    });
    if (!userSurvey || userSurvey.userId !== userId)
      throw new Error('권한 없음');
    // 결과 해석 정보
    const result = await this.prisma.surveyResult.findFirst({
      where: {
        surveyTypeId: userSurvey.surveyTypeId,
        minScore: { lte: userSurvey.totalScore },
        maxScore: { gte: userSurvey.totalScore },
      },
    });
    return {
      ...userSurvey,
      resultLabel: result?.label,
      resultDescription: result?.description,
    };
  }

  // 3. 설문 시작(카테고리 선택 → 질문지 반환)
  async startProfessionalSurvey(userId: number, categoryCode: string) {
    const surveyType = await this.prisma.surveyType.findFirst({
      where: { category: { code: categoryCode }, type: 'professional' },
    });
    if (!surveyType) throw new Error('해당 카테고리의 전문 설문이 없습니다.');
    const questions = await this.prisma.surveyQuestion.findMany({
      where: { surveyTypeId: surveyType.id },
      orderBy: { order: 'asc' },
    });
    return {
      surveyType: surveyType.code,
      minScale: surveyType.minScale,
      maxScale: surveyType.maxScale,
      questions,
    };
  }

  // 4. 설문 결과 제출(채점 및 결과 반환)
  async submitProfessionalSurvey(
    userId: number,
    dto: { surveyType: string; answers: number[] }
  ) {
    const surveyType = await this.prisma.surveyType.findUnique({
      where: { code: dto.surveyType },
      select: { id: true, minScale: true, maxScale: true },
    });
    if (!surveyType) throw new Error('설문타입이 존재하지 않습니다.');
    const questions = await this.prisma.surveyQuestion.findMany({
      where: { surveyTypeId: surveyType.id },
      orderBy: { order: 'asc' },
    });
    if (dto.answers.length !== questions.length)
      throw new Error('응답 개수가 문항 수와 다릅니다.');
    const minScale = surveyType.minScale;
    const maxScale = surveyType.maxScale;
    const totalScore = questions.reduce((sum, q, i) => {
      const answer = dto.answers[i];
      if (q.isReverse) {
        return sum + (maxScale + minScale - answer);
      } else {
        return sum + answer;
      }
    }, 0);
    // 결과 해석
    const result = await this.prisma.surveyResult.findFirst({
      where: {
        surveyTypeId: surveyType.id,
        minScore: { lte: totalScore },
        maxScore: { gte: totalScore },
      },
    });
    // 결과 저장
    const userSurvey = await this.prisma.userSurvey.create({
      data: {
        userId,
        surveyTypeId: surveyType.id,
        totalScore,
        interpretation: result?.label || '',
        answers: dto.answers,
      },
    });
    return {
      totalScore,
      interpretation: result?.label,
      userSurveyId: userSurvey.id,
    };
  }
}
