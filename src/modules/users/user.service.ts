import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { ChangeNameDTO } from './dto/ChangeNameDTO';
import { BasicInfoDTO } from './dto/BasicInfoDTO';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: number) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        googleAccessToken: true,
        googleRefreshToken: true,
        googleTokenExpiry: true,
      },
    });
  }

  async updateMe(userId: number, dto: ChangeNameDTO) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name },
    });
  }

  async deleteMe(userId: number) {
    return await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async updateBasicInfo(userId: number, dto: BasicInfoDTO) {
    // 1. 사용자 정보 업데이트
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        gender: dto.gender,
        age: dto.age,
      },
    });

    // 2. 고민유형(카테고리 코드)에 맞는 surveyType 찾기
    const surveyType = await this.prisma.surveyType.findFirst({
      where: { category: { code: dto.categoryCode } },
    });
    if (!surveyType) throw new Error('해당 고민유형에 맞는 검사가 없습니다.');

    // 3. 나이로 ageGroup 결정 (예: 10대: teen, 20대 이상: adult)
    const ageGroup = dto.age < 20 ? 'teen' : 'adult';

    // 4. 해당 surveyType과 ageGroup에 맞는 문항 반환
    const questions = await this.prisma.surveyQuestion.findMany({
      where: { surveyTypeId: surveyType.id, ageGroup },
      orderBy: { order: 'asc' },
    });

    return {
      surveyType: surveyType.code,
      questions,
    };
  }

  async updateFcmToken(userId: number, token: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { fcmToken: token },
    });
  }
}
