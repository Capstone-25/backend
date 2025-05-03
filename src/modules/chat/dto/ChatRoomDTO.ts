import { ApiProperty } from '@nestjs/swagger';

export class ChatRoomDTO {
  @ApiProperty({
    description: '채팅방 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '채팅방 제목',
    example: '첫 번째 대화',
  })
  title: string;

  @ApiProperty({
    description: '채팅방 생성 시간',
    example: '2024-05-03T12:00:00.000Z',
  })
  createdAt: Date;
}
