import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VoiceService {
  constructor(private prisma: PrismaService) {}

  async sendToAIServer(user: any, sessionId: number, message: string) {
    // 사용자 정보 조회
    const userInfo = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });

    // 채팅 세션 정보 조회
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    // 사용자가 보내는 메세지를 DB에 저장
    await this.prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        sender: userInfo.name,
        content: message,
      },
    });
    // AI 서버에 전달할 데이터 구성
    const aiServerUrl = 'http://43.200.169.229:8000/voice_chat';
    const payload = {
      userId: user.userId,
      chatId: sessionId,
      persona: session.persona,
      name: userInfo.name,
      age: userInfo.age,
      gender: userInfo.gender,
      message,
    };

    // AI 서버에 JSON으로 POST 요청
    const response = await axios.post(aiServerUrl, payload);

    // AI 응답 DB에 저장
    await this.prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        sender: 'bot',
        content: response.data.botResponse,
        voiceUrl: response.data.audioResponse,
      },
    });

    // 응답 반환
    return {
      userId: user.userId,
      chatId: sessionId,
      message,
      botResponse: response.data.botResponse,
      audioResponse: response.data.audioResponse,
      persona: session.persona,
      timestamp: new Date(),
    };
  }
}
