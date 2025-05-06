import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VoiceService } from './voice.service';
import { Response } from 'express';
import { Express } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VoiceChatSwagger } from './swagger/voice.swagger';

@Controller('voice-chat')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post(':sessionId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @VoiceChatSwagger()
  async handleVoiceChat(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Param('sessionId') sessionId: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.voiceService.sendToAIServer(
        file,
        req.user,
        parseInt(sessionId)
      );
      // result: { answerText: string, ttsAudioUrl: string }
      return res.json(result);
    } catch (e) {
      throw new HttpException(
        'AI 서버 처리 실패',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
      console.log(e);
    }
  }
}
