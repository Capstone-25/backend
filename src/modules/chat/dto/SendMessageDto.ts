import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: '전송할 메시지',
    example: '안녕하세요',
  })
  message: string;
}
