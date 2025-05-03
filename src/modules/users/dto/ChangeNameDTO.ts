import { ApiProperty } from '@nestjs/swagger';

export class ChangeNameDTO {
  @ApiProperty({
    description: '변경할 사용자 이름',
    example: '홍길동',
  })
  name: string;
}
