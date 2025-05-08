import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
import { GetUser } from '@src/modules/auth/decorators/get-user.decorator';
import { SurveyService } from './survey.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Survey')
@Controller('surveys')
@UseGuards(JwtAuthGuard)
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  // 전문 설문조사 전체 목록
  @Get('history')
  async getMyProfessionalSurveys(@GetUser() user: any) {
    return this.surveyService.getMyProfessionalSurveys(user.userId);
  }

  // 전문 설문조사 상세
  @Get(':userSurveyId')
  async getProfessionalSurveyDetail(
    @GetUser() user: any,
    @Param('userSurveyId') userSurveyId: string
  ) {
    return this.surveyService.getProfessionalSurveyDetail(
      user.userId,
      +userSurveyId
    );
  }

  // 전문 설문조사 시작(카테고리 선택)
  @Post('start')
  async startProfessionalSurvey(
    @GetUser() user: any,
    @Body() dto: { categoryCode: string }
  ) {
    return this.surveyService.startProfessionalSurvey(
      user.userId,
      dto.categoryCode
    );
  }

  // 전문 설문조사 결과 제출
  @Post('submit')
  async submitProfessionalSurvey(
    @GetUser() user: any,
    @Body() dto: { surveyType: string; answers: number[] }
  ) {
    return this.surveyService.submitProfessionalSurvey(user.userId, dto);
  }
}
