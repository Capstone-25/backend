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
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        gender: dto.gender,
        age: dto.age,
      },
    });
  }

  // TODO: Survey 모델이 추가되면 구현 예정
  async createSurvey(userId: number, dto: any) {
    // return await this.prisma.survey.create({
    //   data: {
    //     userId,
    //     ...dto,
    //   },
    // });
  }
}
