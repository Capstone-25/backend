import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class BasicInfoDTO {
  @ApiProperty({
    enum: Gender,
    description: '성별 (male, female, other)',
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
}
