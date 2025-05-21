import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsDate } from 'class-validator';

export class ChatResponseDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: '채팅방 ID',
    example: 1,
  })
  @IsInt()
  chatId: number;

  @ApiProperty({
    description: 'AI 응답 메시지',
    example: '안녕하세요! 오늘은 어떤 이야기를 나누고 싶으신가요?',
  })
  @IsString()
  botResponse: string;

  @ApiProperty({
    description: '응답 시간',
    example: '2024-05-03T12:00:00.000Z',
  })
  @IsDate()
  timestamp: Date;

  @ApiProperty({
    description: '페르소나',
    example: '26살_한여름',
  })
  @IsString()
  persona: string;
}
