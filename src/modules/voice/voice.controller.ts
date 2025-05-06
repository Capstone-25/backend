import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VoiceService } from './voice.service';
import { Response } from 'express';
import { Express } from 'express';
@Controller('voice-chat')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handleVoiceChat(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ) {
    try {
      const result = await this.voiceService.sendToAIServer(file);
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
