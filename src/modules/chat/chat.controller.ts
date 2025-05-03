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
import { ChatResponseDTO } from './dto/ChatResponseDTO';
import { ChatMessageDTO } from './dto/ChatMessageDTO';
import { ApiTags } from '@nestjs/swagger';
import { ChatSwagger } from './swagger/chat.swagger';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 5. 새 채팅방 생성
  @Post()
  @ChatSwagger.createSession.operation
  @ChatSwagger.createSession.response
  async createSession(@Req() req, @Body() dto: CreateSessionDto) {
    return this.chatService.createSession(req.user.userId, dto.title);
  }

  // 6. 채팅방 삭제
  @Delete(':sessionId')
  @ChatSwagger.deleteSession.operation
  @ChatSwagger.deleteSession.param
  @ChatSwagger.deleteSession.response
  async deleteSession(@Param('sessionId') id: string) {
    return this.chatService.deleteSession(+id);
  }

  @Get(':sessionId/messages')
  @ChatSwagger.getChatMessages.operation
  @ChatSwagger.getChatMessages.param
  @ChatSwagger.getChatMessages.response
  async getChatMessages(
    @Param('sessionId') id: string
  ): Promise<ChatMessageDTO[]> {
    return this.chatService.getChatMessages(+id);
  }

  // 1. 메시지 전송 및 응답 받기
  @Post(':sessionId/message')
  @ChatSwagger.sendMessage.operation
  @ChatSwagger.sendMessage.param
  @ChatSwagger.sendMessage.body
  @ChatSwagger.sendMessage.response
  async sendMessage(
    @Req() req,
    @Param('sessionId') id: string,
    @Body() dto: SendMessageDto
  ): Promise<ChatResponseDTO> {
    return this.chatService.sendMessage(req.user, +id, dto.message);
  }

  // 3. 페르소나 변경
  @Patch(':sessionId/persona')
  @ChatSwagger.changePersona.operation
  @ChatSwagger.changePersona.param
  @ChatSwagger.changePersona.body
  @ChatSwagger.changePersona.response
  async changePersona(
    @Param('sessionId') id: string,
    @Body() dto: ChangePersonaDto
  ) {
    return this.chatService.changePersona(+id, dto.persona);
  }

  // 4. 채팅 종료 & 분석 요청
  @Post(':sessionId/end')
  @ChatSwagger.endSession.operation
  @ChatSwagger.endSession.param
  @ChatSwagger.endSession.response
  async endSession(@Param('sessionId') id: string) {
    return this.chatService.endSession(+id);
  }
}
