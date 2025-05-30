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
import { SendMessageDto } from './dto/SendMessageDto';
import { ChangePersonaDto } from './dto/ChangePersonaDto';
import { ChatResponseDto } from './dto/ChatResponseDto';
import { ChatMessageDto } from './dto/ChatMessageDto';
import { ApiTags } from '@nestjs/swagger';
import { ChatSwagger } from './swagger/chat.swagger';
import { CreateSessionDto } from './dto/CreateSessionDto';
import { Public } from '@src/common/decorators/public.decorator';
@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ChatSwagger.getChats.operation
  @ChatSwagger.getChats.response
  async getChats(@Req() req) {
    return this.chatService.getChats(req.user.userId);
  }

  // 5. 새 채팅방 생성
  @Post()
  @ChatSwagger.createSession.operation
  @ChatSwagger.createSession.body
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
  ): Promise<ChatMessageDto[]> {
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
  ): Promise<ChatResponseDto> {
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
  async endSession(@Req() req, @Param('sessionId') id: string) {
    return this.chatService.endSession(req.user.userId, +id);
  }

  // 2. 인사 메시지 전송
  @Post(':sessionId/greet')
  @ChatSwagger.greet.operation
  @ChatSwagger.greet.param
  @ChatSwagger.greet.response
  async greet(@Req() req, @Param('sessionId') id: string) {
    return this.chatService.greet(req.user, +id);
  }

  @Patch(':sessionId/first-message')
  async updateFirstMessage(
    @Param('sessionId') id: string,
    @Body() persona: string
  ) {
    return this.chatService.updateFirstMessage(+id, persona);
  }

  // 테스트용: 인증 없이 모닝 푸시/챗 실행
  @Post('test-morning-push')
  @Public()
  async testMorningPush() {
    await this.chatService.sendMorningPushToAnalyzedUsers();
    return { success: true };
  }
}
