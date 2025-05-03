import { Injectable } from '@nestjs/common';
//import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '@src/prisma/prisma.service';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { ChatResponseDTO } from './dto/ChatResponseDTO';
import { ChatMessageDTO } from './dto/ChatMessageDTO';
// 구글핏
@Injectable()
export class ChatService {
  private aiServer = process.env.AI_SERVER_URL;
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService
  ) {}

  // 5. 새로운 채팅방 생성
  async createSession(userId: number, title?: string) {
    return this.prisma.chatSession.create({
      data: { userId, title },
    });
  }

  // 6. 채팅방 삭제
  async deleteSession(sessionId: number) {
    await this.prisma.chatSession.delete({ where: { id: sessionId } });
  }

  // 7. 채팅방 메시지 조회
  async getChatMessages(sessionId: number): Promise<ChatMessageDTO[]> {
    const messages = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
    });

    return messages.map(message => ({
      id: message.id,
      sessionId: message.sessionId,
      sender: message.sender,
      content: message.content,
      timestamp: message.timestamp,
    }));
  }

  // 1. 사용자 메시지 저장 및 AI 서버 전송
  async sendMessage(
    user: any,
    sessionId: number,
    message: string
  ): Promise<ChatResponseDTO> {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });
    const userInfo = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });

    // 1-1. 사용자 메시지 DB 저장
    await this.prisma.chatMessage.create({
      data: {
        sessionId,
        sender: userInfo.name,
        content: message,
      },
    });

    // 1-2. AI 서버에 전송 및 응답 받기
    const response = await axios.post(`${this.aiServer}/chat/send`, {
      userId: user.userId,
      chatId: sessionId,
      persona: session.persona,
      userName: userInfo.name,
      userAge: userInfo.age,
      userGender: userInfo.gender,
      message,
    });

    // 1-3. AI 응답 DB에 저장
    await this.prisma.chatMessage.create({
      data: {
        sessionId,
        sender: 'bot',
        content: response.data.botResponse,
      },
    });

    // 1-4. 응답 반환
    return {
      userId: user.userId,
      chatId: sessionId,
      botResponse: response.data.botResponse,
      timestamp: new Date(),
    };
  }

  // 3. 페르소나 변경
  async changePersona(sessionId: number, persona: string) {
    return this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { persona },
    });
  }

  // 4. 채팅 종료 및 분석 요청
  async endSession(sessionId: number) {
    const res = await axios.post(`${this.aiServer}/chat/analyze`, {
      sessionId,
    });
    return res.data;
  }
}
