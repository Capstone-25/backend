import { BadRequestException, Injectable } from '@nestjs/common';
//import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '@src/prisma/prisma.service';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { ChatResponseDto } from './dto/ChatResponseDto';
import { ChatMessageDto } from './dto/ChatMessageDto';
import { NotificationService } from '@src/modules/notification/notification.service';
import { Cron } from '@nestjs/schedule';
// 구글핏
@Injectable()
export class ChatService {
  private aiServer = process.env.AI_SERVER_URL;
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly notificationService: NotificationService
  ) {}

  async getChats(userId: number) {
    const chats = await this.prisma.chatSession.findMany({
      where: { userId },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    // 각 채팅방별 메시지 개수 조회
    const chatIds = chats.map(chat => chat.id);
    // 한 번에 여러 개의 count 쿼리를 날릴 수 없으니, Promise.all로 병렬 처리
    const messageCounts = await Promise.all(
      chatIds.map(chatId =>
        this.prisma.chatMessage.count({
          where: { sessionId: chatId, sender: user.name },
        })
      )
    );
    return chats.map((chat, index) => ({
      chatId: chat.id,
      userId: chat.userId,
      title: chat.title,
      persona: chat.persona,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      isAnalyzable: messageCounts[index] >= 15,
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
            persona: true,
          },
        },
      },
    });

    return messages.map(message => ({
      id: message.id,
      chatId: message.sessionId,
      sender: message.sender,
      message: message.content,
      voiceUrl: message.voiceUrl || null,
      persona: message.chatSession.persona,
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

  async updateFirstMessage(sessionId: number, persona: string) {
    const chatMessageCount = await this.prisma.chatMessage.count({
      where: { sessionId },
    });
    if (chatMessageCount === 0) {
      if (persona === '26살_한여름') {
        await this.prisma.chatSession.update({
          where: {
            id: sessionId,
          },
          data: { persona: '26살_한여름' },
        });
        await this.prisma.chatMessage.create({
          data: {
            sessionId,
            sender: 'bot',
            content: '난 26살 한여름이야 반가워!',
          },
        });
      } else if (persona === '8살_민지원') {
        await this.prisma.chatSession.update({
          where: {
            id: sessionId,
          },
          data: { persona: '8살_민지원' },
        });
        await this.prisma.chatMessage.create({
          data: {
            sessionId,
            sender: 'bot',
            content: '저는 8살 민지원이에요 반가워요!',
          },
        });
      } else {
        await this.prisma.chatSession.update({
          where: {
            id: sessionId,
          },
          data: { persona: '55살_김서연' },
        });
        await this.prisma.chatMessage.create({
          data: {
            sessionId,
            sender: 'bot',
            content: '저는 55살 김서연이에요 반가워요!',
          },
        });
      }
    } else {
      const personaName = await this.getPersonaDisplayName(persona);
      await this.prisma.chatMessage.create({
        data: {
          sessionId,
          sender: 'bot',
          content: `페르소나가 ${personaName}(으)로 변경되었어요. 새롭게 대화를 시작해볼까요?`,
        },
      });
    }
  }

  private async getPersonaDisplayName(personaName?: string) {
    const parts = personaName.split('_');
    return parts.length > 1 ? parts[1] : personaName;
  }
  // 3. 페르소나 변경
  // 페르소나 변경시 하드코딩된 메세지를 DB에 저장
  async changePersona(sessionId: number, persona: string) {
    await this.updateFirstMessage(sessionId, persona);
    return await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { persona },
    });
  }

  // 4. 채팅 종료 및 분석 요청
  async endSession(userId: number, sessionId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    const userMessageCount = await this.prisma.chatMessage.count({
      where: { sessionId, sender: user.name },
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
    const randomExp = [10, 30, 50, 70, 90];
    if (Array.isArray(report.report.missions)) {
      for (const mission of report.report.missions) {
        const randomExpIndex = Math.floor(Math.random() * randomExp.length);
        await this.prisma.mission.create({
          data: {
            sessionId: sessionId,
            userId: userId,
            title: mission.title,
            detail: mission.detail,
            period: mission.period,
            frequency: mission.frequency,
            missionExp: randomExp[randomExpIndex],
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

  // 매일 아침 9시 분석레포트가 있는 유저에게 모닝 챗/푸시알림 전송
  async sendMorningPushToAnalyzedUsers() {
    // 1. 분석레포트가 존재하는 유저별로 가장 최근 분석레포트의 sessionId(chatId) 조회
    const latestAnalyses = await this.prisma.chatAnalysis.groupBy({
      by: ['userId'],
      _max: { timestamp: true },
    });

    for (const { userId, _max } of latestAnalyses) {
      // 2. 해당 userId, timestamp로 가장 최근 chatAnalysis를 찾고, sessionId(chatId) 추출
      const analysis = await this.prisma.chatAnalysis.findFirst({
        where: { userId, timestamp: _max.timestamp },
        orderBy: { timestamp: 'desc' },
      });
      if (!analysis) continue;

      const chatId = analysis.sessionId;

      // 3. 사용자 정보 조회
      const userInfo = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!userInfo) continue;

      // 4. AI 서버에 모닝 메시지 생성 요청
      const response = await axios.post(`${this.aiServer}/generate_greet`, {
        userId,
        chatId,
        name: userInfo.name,
        age: userInfo.age,
        gender: userInfo.gender,
      });
      const message =
        response.data.message || response.data.greet || response.data.text;

      // 5. 메시지 DB 저장
      await this.prisma.chatMessage.create({
        data: {
          sessionId: chatId,
          sender: 'bot',
          content: message,
          timestamp: new Date(),
        },
      });

      // 6. 푸시알림 전송
      await this.notificationService.sendPushNotification(
        userId,
        '토닥이의 아침 인사',
        message
      );
    }
  }

  // 매일 오전 9시에 자동 실행되는 Cron 등록
  @Cron('0 9 * * *')
  async handleMorningPushCron() {
    await this.sendMorningPushToAnalyzedUsers();
  }
}
