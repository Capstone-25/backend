import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
import { CreateSessionDto } from './dto/CreateSessionDTO';
import { SendMessageDto } from './dto/SendMessageDto';
import { ChangePersonaDto } from './dto/ChangePersonaDTO';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 5. 새 채팅방 생성
  @Post()
  async createSession(@Req() req, @Body() dto: CreateSessionDto) {
    return this.chatService.createSession(req.user.userId, dto.title);
  }

  // 6. 채팅방 삭제
  @Delete(':sessionId')
  async deleteSession(@Param('sessionId') id: string) {
    return this.chatService.deleteSession(+id);
  }

  // 1. 메시지 전송
  @Post(':sessionId/message')
  async sendMessage(
    @Req() req,
    @Param('sessionId') id: string,
    @Body() dto: SendMessageDto
  ) {
    return this.chatService.sendMessage(req.user, +id, dto.message);
  }

  // 2. 챗봇 답변 조회
  @Get(':sessionId/response')
  async getResponse(@Req() req, @Param('sessionId') id: string) {
    return this.chatService.getResponse(req.user, +id);
  }

  // 3. 페르소나 변경
  @Patch(':sessionId/persona')
  async changePersona(
    @Param('sessionId') id: string,
    @Body() dto: ChangePersonaDto
  ) {
    return this.chatService.changePersona(+id, dto.persona);
  }

  // 4. 채팅 종료 & 분석 요청
  @Post(':sessionId/end')
  async endSession(@Param('sessionId') id: string) {
    return this.chatService.endSession(+id);
  }
}
