import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class BasicInfoDTO {
  @ApiProperty({
    enum: Gender,
    description: '성별 (male, female)',
    example: 'male',
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    description: '나이',
    example: 25,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    description: '고민유형 카테고리 코드',
    example: 'depression',
  })
  @IsNotEmpty()
  categoryCode: string;

  @ApiProperty({
    description: '설문 응답값 배열',
    example: [1, 2, 3],
  })
  @IsNotEmpty()
  answers: number[];
}
