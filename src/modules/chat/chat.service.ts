import { BadRequestException, Injectable } from '@nestjs/common';
//import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '@src/prisma/prisma.service';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { ChatResponseDto } from './dto/ChatResponseDto';
import { ChatMessageDto } from './dto/ChatMessageDto';
// 구글핏
@Injectable()
export class ChatService {
  private aiServer = process.env.AI_SERVER_URL;
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService
  ) {}

  async getChats(userId: number) {
    const chats = await this.prisma.chatSession.findMany({
      where: { userId },
    });
    return chats.map(chat => ({
      chatId: chat.id,
      userId: chat.userId,
      title: chat.title,
      persona: chat.persona,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }));
  }

  // 5. 새로운 채팅방 생성
  async createSession(userId: number, title?: string) {
    const session = await this.prisma.chatSession.create({
      data: { userId: userId, title: title },
    });
    // 반환값에서 id를 chatId로 바꿔서 반환
    return {
      chatId: session.id,
      userId: session.userId,
      title: session.title,
      persona: session.persona,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  // 6. 채팅방 삭제
  async deleteSession(sessionId: number) {
    await this.prisma.chatSession.delete({ where: { id: sessionId } });
  }

  // 7. 채팅방 메시지 조회
  async getChatMessages(chatId: number): Promise<ChatMessageDto[]> {
    const messages = await this.prisma.chatMessage.findMany({
      where: { sessionId: chatId },
      orderBy: { timestamp: 'asc' },
      include: {
        chatSession: {
          select: {
            userId: true,
          },
        },
      },
    });

    return messages.map(message => ({
      id: message.id,
      chatId: message.sessionId,
      userId: message.sender === 'user' ? message.chatSession.userId : 0, // 봇은 0, 사용자는 실제 userId
      message: message.content,
      createdAt: message.timestamp,
    }));
  }

  // 1. 사용자 메시지 저장 및 AI 서버 전송
  async sendMessage(
    user: any,
    sessionId: number,
    message: string
  ): Promise<ChatResponseDto> {
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
    const response = await axios.post(`${this.aiServer}/start_chat`, {
      userId: user.userId,
      chatId: sessionId,
      persona: session.persona,
      name: userInfo.name,
      age: userInfo.age,
      gender: userInfo.gender,
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
      persona: session.persona,
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
  async endSession(userId: number, sessionId: number) {
    const userMessageCount = await this.prisma.chatMessage.count({
      where: { sessionId, sender: 'user' },
    });
    if (userMessageCount < 15) {
      throw new BadRequestException('15턴 이상 대화 시 분석이 가능합니다.');
    }
    // 1. AI 서버에 분석 요청
    const res = await axios.post(`${this.aiServer}/generate_report`, {
      userId,
      chatId: sessionId,
    });
    const report = res.data;

    // 2. 분석 결과 저장 (ChatAnalysis)
    await this.prisma.chatAnalysis.create({
      data: {
        sessionId: sessionId,
        userId: userId,
        timestamp: report.timestamp ? new Date(report.timestamp) : new Date(),
        topic: report.report.missionTopic,
        emotion: report.report.missionEmotion,
        distortions: report.report.missionDistortion,
      },
    });

    // 3. 미션 저장 (Mission)
    if (Array.isArray(report.report.missions)) {
      for (const mission of report.report.missions) {
        await this.prisma.mission.create({
          data: {
            sessionId: sessionId,
            userId: userId,
            title: mission.title,
            detail: mission.detail,
            period: mission.period,
            frequency: mission.frequency,
          },
        });
      }
    }

    return report;
  }

  async greet(user: any, sessionId: number) {
    const userInfo = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });
    const response = await axios.post(`${this.aiServer}/generate_greet`, {
      userId: user.userId,
      chatId: sessionId,
      name: userInfo.name,
      age: userInfo.age,
      gender: userInfo.gender,
    });
    await this.prisma.chatMessage.create({
      data: {
        sessionId,
        sender: 'bot',
        content: response.data.greet,
        timestamp: new Date(),
      },
    });
    return response.data;
  }
}
