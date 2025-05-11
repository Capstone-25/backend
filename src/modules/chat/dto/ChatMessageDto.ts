import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsDate } from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({
    description: '메시지 ID',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: '채팅방 ID',
    example: 1,
  })
  @IsInt()
  chatId: number;

  @ApiProperty({
    description: '사용자 ID (봇은 0)',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: '메시지 내용',
    example: '안녕하세요',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: '메시지 생성 시간',
    example: '2024-05-03T12:00:00.000Z',
  })
  @IsDate()
  createdAt: Date;
}
