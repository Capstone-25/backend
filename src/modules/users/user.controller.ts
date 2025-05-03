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
import { ChangeNameDTO } from './dto/ChangeNameDTO';
import { UserSwagger } from './swagger/user.swagger';
import { BasicInfoDTO } from './dto/BasicInfoDTO';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UserSwagger.controller
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
  async updateMe(@GetUser() user: any, @Body() dto: ChangeNameDTO) {
    return await this.userService.updateMe(user.userId, dto);
  }

  @Delete('me')
  @UserSwagger.deleteMe.operation
  @UserSwagger.deleteMe.response
  async deleteMe(@GetUser() user: any) {
    return await this.userService.deleteMe(user.userId);
  }

  @Post('basic-info')
  @UserSwagger.createSurvey.operation
  @UserSwagger.createSurvey.response
  async updateBasicInfo(@GetUser() user: any, @Body() dto: BasicInfoDTO) {
    return await this.userService.updateBasicInfo(user.userId, dto);
  }
}
