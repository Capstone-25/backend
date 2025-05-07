import { ApiProperty } from '@nestjs/swagger';

export class ChangePersonaDto {
  @ApiProperty({
    description: '변경할 페르소나',
    example: '8살_민지원',
    enum: ['8살_민지원', '26살_한여름', '55살_김서연'],
  })
  persona: string; // 8살_민지원, 26살_한여름 , 55살_김서연
}

// 마이페이지에서 푸시알림 동의
// 이름 바꿀수 있음
// 프로필사진 안바꿈
// 레벨 있음
// For commit
