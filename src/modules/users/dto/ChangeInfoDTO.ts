import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
export class ChangeInfoDTO {
  @ApiProperty({
    description: '변경할 사용자 이름',
    example: '홍길동',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: '변경할 사용자 성별',
    example: '남자',
  })
  @IsString()
  @IsOptional()
  gender: string;

  @ApiProperty({
    description: '변경할 사용자 나이',
    example: 20,
  })
  @IsNumber()
  @IsOptional()
  age: number;
}
