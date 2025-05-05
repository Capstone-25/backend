import { ApiProperty } from '@nestjs/swagger';

export class CalendarEventTimeDto {
  @ApiProperty({ example: '2024-05-03T10:00:00+09:00' })
  dateTime: string;

  @ApiProperty({ example: 'Asia/Seoul' })
  timeZone?: string;
}

export class CalendarEventDto {
  @ApiProperty({ example: 'event123' })
  id: string;

  @ApiProperty({ example: '회의' })
  summary: string;

  @ApiProperty({ example: '주간 회의' })
  description?: string;

  @ApiProperty()
  start: CalendarEventTimeDto;

  @ApiProperty()
  end: CalendarEventTimeDto;

  @ApiProperty({ example: '회의실 A' })
  location?: string;

  @ApiProperty({ example: false })
  allDay?: boolean;

  @ApiProperty({ example: ['user1@example.com', 'user2@example.com'] })
  attendees?: { email: string }[];

  @ApiProperty({ example: 'confirmed' })
  status?: string;

  @ApiProperty({ example: '#4285F4' })
  colorId?: string;
}

export class CalendarEventsResponseDto {
  @ApiProperty({ example: '구글 캘린더 연동 성공' })
  message: string;

  @ApiProperty({ type: [CalendarEventDto] })
  events: CalendarEventDto[];
}
