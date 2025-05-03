import { ApiProperty } from '@nestjs/swagger';

export class ChatResponseDTO {
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '채팅방 ID',
    example: 1,
  })
  chatId: number;

  @ApiProperty({
    description: 'AI 응답 메시지',
    example: '안녕하세요! 오늘은 어떤 이야기를 나누고 싶으신가요?',
  })
  botResponse: string;

  @ApiProperty({
    description: '응답 시간',
    example: '2024-05-03T12:00:00.000Z',
  })
  timestamp: Date;
}
