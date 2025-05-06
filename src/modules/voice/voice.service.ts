import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class VoiceService {
  async sendToAIServer(file: any) {
    // AI 서버 주소
    const aiServerUrl = 'http://ai-server/voice-chat';

    // form-data 패키지 사용
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    // axios로 multipart/form-data 전송
    const response = await axios.post(aiServerUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // AI 서버의 응답을 그대로 반환
    return response.data;
  }
}
