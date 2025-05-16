import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { ChangeInfoDTO } from './dto/ChangeInfoDTO';
//import { BasicInfoDTO } from './dto/BasicInfoDTO';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
      },
    });
    return user;
  }

  async updateMe(userId: number, dto: ChangeInfoDTO) {
    if (dto.name) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { name: dto.name },
      });
    }
    if (dto.gender) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { gender: dto.gender },
      });
    }
    if (dto.age) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { age: dto.age },
      });
    }
    return await this.getMe(userId);
  }

  async deleteMe(userId: number) {
    return await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async updateFcmToken(userId: number, token: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { fcmToken: token },
    });
  }

  // 기초 설문조사 질문 조회
  async getBasicSurveyQuestions(
    userId: number,
    dto: { age: number; gender: string; categoryCode: string }
  ) {
    // 1. 유저 정보 업데이트
    await this.prisma.user.update({
      where: { id: userId },
      data: { age: dto.age, gender: dto.gender },
    });
    // 2. 고민유형(카테고리 코드)에 맞는 surveyType 찾기
    const surveyType = await this.prisma.surveyType.findFirst({
      where: { category: { code: dto.categoryCode } },
    });
    if (!surveyType) throw new Error('해당 고민유형에 맞는 검사가 없습니다.');
    // 3. 나이로 ageGroup 결정
    const ageGroup = dto.age < 20 ? 'teen' : 'adult';
    // 4. 해당 surveyType과 ageGroup에 맞는 문항 반환
    const questions = await this.prisma.surveyQuestion.findMany({
      where: { surveyTypeId: surveyType.id, ageGroup },
      orderBy: { order: 'asc' },
    });
    return {
      surveyType: surveyType.code,
      minScale: surveyType.minScale,
      maxScale: surveyType.maxScale,
      questions,
    };
  }

  // 기초 설문조사 답변 제출
  async submitBasicSurvey(
    userId: number,
    dto: { surveyType: string; answers: number[] }
  ) {
    // 1. 설문타입 조회
    const surveyType = await this.prisma.surveyType.findUnique({
      where: { code: dto.surveyType },
      select: { id: true, minScale: true, maxScale: true },
    });
    if (!surveyType) throw new Error('설문타입이 존재하지 않습니다.');
    // 2. 문항 조회
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const ageGroup = user.age < 20 ? 'teen' : 'adult'; // 필요시 senior도 추가
    const questions = await this.prisma.surveyQuestion.findMany({
      where: { surveyTypeId: surveyType.id, ageGroup },
      orderBy: { order: 'asc' },
    });
    if (dto.answers.length !== questions.length)
      throw new Error('응답 개수가 문항 수와 다릅니다.');
    // 3. 점수 계산(역문항 처리)
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
    // 4. 결과 해석
    const result = await this.prisma.surveyResult.findFirst({
      where: {
        surveyTypeId: surveyType.id,
        minScore: { lte: totalScore },
        maxScore: { gte: totalScore },
      },
    });
    const interpretation = result ? result.label : null;
    // 5. 결과 저장
    await this.prisma.userSurvey.create({
      data: {
        userId,
        surveyTypeId: surveyType.id,
        totalScore,
        interpretation: interpretation || '',
        answers: dto.answers,
      },
    });
    return {
      totalScore,
      interpretation,
    };
  }

  // 기초 심리검사 완료 여부 확인
  async isBasicSurveyCompleted(
    userId: number
  ): Promise<{ completed: boolean }> {
    // 기초 설문에 해당하는 surveyTypeId 목록이 여러 개라면, 조건 추가 가능
    const completed = await this.prisma.userSurvey.findFirst({
      where: { userId },
    });
    return { completed: !!completed };
  }
}
