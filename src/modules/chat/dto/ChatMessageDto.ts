import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({
    description: '메시지 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '채팅방 ID',
    example: 1,
  })
  chatId: number;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '메시지 내용',
    example: '안녕하세요',
  })
  message: string;

  @ApiProperty({
    description: '메시지 생성 시간',
    example: '2024-05-03T12:00:00.000Z',
  })
  createdAt: Date;
}
