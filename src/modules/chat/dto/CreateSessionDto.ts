import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({
    description: '채팅방 제목',
    required: false,
    example: '첫 번째 대화',
  })
  title?: string;
}
