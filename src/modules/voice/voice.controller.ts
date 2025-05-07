import {
  Controller,
  Post,
  Res,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  Param,
  Body,
} from '@nestjs/common';
import { VoiceService } from './voice.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VoiceChatSwagger } from './swagger/voice.swagger';

@Controller('voice-chat')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post(':sessionId')
  @UseGuards(JwtAuthGuard)
  @VoiceChatSwagger()
  async handleVoiceChat(
    @Param('sessionId') sessionId: string,
    @Body() body: { message: string },
    @Req() req,
    @Res() res: Response
  ) {
    try {
      const result = await this.voiceService.sendToAIServer(
        req.user,
        Number(sessionId),
        body.message
      );
      return res.json(result);
    } catch {
      throw new HttpException(
        'AI 서버 처리 실패',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
