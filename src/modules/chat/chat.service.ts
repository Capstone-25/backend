import { Injectable } from '@nestjs/common';
//import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '@src/prisma/prisma.service';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
// ChatService: 비즈니스 로직
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

  // 1. 사용자 메시지 저장 및 AI 서버 전송
  async sendMessage(user: any, sessionId: number, message: string) {
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
    // 1-2. AI 서버에 전송
    await axios.post(`${this.aiServer}/chat/send`, {
      userId: user.userId,
      userName: userInfo.name,
      userAgeGroup: userInfo.ageGroup,
      sessionId,
      persona: session.persona,
      message,
    });
  }

  // 2. 챗봇 답변 받아오기
  async getResponse(user: any, sessionId: number) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });
    const userInfo = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });
    const res = await axios.get(`${this.aiServer}/chat/receive`, {
      params: { sessionId },
    });
    const reply = res.data.reply;
    // DB 저장
    return this.prisma.chatMessage.create({
      data: {
        sessionId,
        sender: 'bot',
        content: reply,
      },
    });
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
    // 간단히 분석 요청 예시
    const res = await axios.post(`${this.aiServer}/chat/analyze`, {
      sessionId,
    });
    return res.data;
  }
}
