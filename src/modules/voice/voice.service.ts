import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VoiceService {
  constructor(private prisma: PrismaService) {}

  async sendToAIServer(file: any, user: any, sessionId: number) {
    // AI 서버 주소
    const aiServerUrl = 'http://13.125.242.109:8000/voice_chat';

    // 사용자 정보 조회
    const userInfo = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });

    // 채팅 세션 정보 조회
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    // form-data 패키지 사용
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('userId', user.userId.toString());
    formData.append('chatId', sessionId.toString());
    formData.append('persona', session.persona);
    formData.append('name', userInfo.name);
    formData.append('age', userInfo.age.toString());
    formData.append('gender', userInfo.gender);

    // axios로 multipart/form-data 전송
    const response = await axios.post(aiServerUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // AI 응답 DB에 저장
    await this.prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        sender: 'bot',
        content: response.data.botResponse,
      },
    });

    // AI 서버의 응답을 그대로 반환
    return {
      userId: user.userId,
      chatId: sessionId,
      message: response.data.message,
      botResponse: response.data.botResponse,
      audioResponse: response.data.audioResponse,
      timestamp: new Date(),
    };
  }
}
