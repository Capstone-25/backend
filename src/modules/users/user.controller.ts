import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ChangeInfoDTO } from './dto/ChangeInfoDTO';
import { UserSwagger } from './swagger/user.swagger';
import { ApiTags } from '@nestjs/swagger';
import { BasicInfoSwagger } from './swagger/basic-info.swagger';
//import { BasicInfoDTO } from './dto/BasicInfoDTO';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UserSwagger.controller
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me') // 내 정보 조회 (이름, 이메일, 성별, 나이, 레벨 (데이터베이스에 추가해야함 기본 레벨 1), 프로필 이미지)
  @UserSwagger.getMe.operation
  @UserSwagger.getMe.response
  async getMe(@GetUser() user: any) {
    return await this.userService.getMe(user.userId);
  }

  @Put('me')
  @UserSwagger.updateMe.operation
  @UserSwagger.updateMe.response
  async updateMe(@GetUser() user: any, @Body() dto: ChangeInfoDTO) {
    return await this.userService.updateMe(user.userId, dto);
  }

  @Delete('me')
  @UserSwagger.deleteMe.operation
  @UserSwagger.deleteMe.response
  async deleteMe(@GetUser() user: any) {
    return await this.userService.deleteMe(user.userId);
  }

  // @Post('basic-info')
  // @UserSwagger.createSurvey.operation
  // @UserSwagger.createSurvey.response
  // async updateBasicInfo(@GetUser() user: any, @Body() dto: BasicInfoDTO) {
  //   return await this.userService.updateBasicInfo(user.userId, dto);
  // }

  @Post('fcm-token')
  async updateFcmToken(@GetUser() user: any, @Body() body: { token: string }) {
    await this.userService.updateFcmToken(user.userId, body.token);
    return { success: true };
  }

  @Post('basic-info/questions')
  @BasicInfoSwagger.getQuestions.operation
  @BasicInfoSwagger.getQuestions.body
  @BasicInfoSwagger.getQuestions.response
  async getBasicSurveyQuestions(
    @GetUser() user: any,
    @Body() dto: { age: number; gender: string; categoryCode: string }
  ) {
    return await this.userService.getBasicSurveyQuestions(user.userId, dto);
  }

  @Post('basic-info/submit')
  @BasicInfoSwagger.submit.operation
  @BasicInfoSwagger.submit.body
  @BasicInfoSwagger.submit.response
  async submitBasicSurvey(
    @GetUser() user: any,
    @Body() dto: { surveyType: string; answers: number[] }
  ) {
    return await this.userService.submitBasicSurvey(user.userId, dto);
  }

  @Get('basic-info/completed')
  @UserSwagger.basicSurveyCompleted.operation
  @UserSwagger.basicSurveyCompleted.response
  async isBasicSurveyCompleted(@GetUser() user: any) {
    return await this.userService.isBasicSurveyCompleted(user.userId);
  }
}
