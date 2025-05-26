import {
  Controller,
  Get,
  UseGuards,
  Req,
  Body,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
import { CalendarService } from './calendar.service';
import {
  CalendarEventsResponseDto,
  CalendarEventDto,
} from './dto/calendar-event.dto';

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '구글 캘린더 이벤트 조회' })
  @ApiResponse({
    status: 200,
    description: '구글 캘린더 이벤트 조회 성공',
    type: CalendarEventsResponseDto,
  })
  async getCalendarEvents(@Req() req): Promise<CalendarEventsResponseDto> {
    console.log(req.user.userId);
    const events = await this.calendarService.getCalendarEvents(
      req.user.userId
    );
    // 구글 이벤트 → CalendarEventDto로 변환
    const eventDtos: CalendarEventDto[] = events.map(event => ({
      id: event.id ?? '',
      summary: event.summary ?? '',
      description: event.description ?? '',
      start: { dateTime: event.start?.dateTime ?? event.start?.date ?? '' },
      end: { dateTime: event.end?.dateTime ?? event.end?.date ?? '' },
      location: event.location ?? '',
      // 필요에 따라 추가 필드 매핑
    }));

    return {
      message: '구글 캘린더 연동 성공',
      events: eventDtos,
    };
  }

  @Get('db-events')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'DB에 저장된 캘린더 이벤트 조회' })
  @ApiResponse({
    status: 200,
    description: 'DB에 저장된 캘린더 이벤트 조회 성공',
    type: CalendarEventsResponseDto,
  })
  async getDbCalendarEvents(@Req() req): Promise<CalendarEventsResponseDto> {
    const dbEvents = await this.calendarService.getDbCalendarEvents(
      req.user.userId
    );
    const events = dbEvents.map(event => ({
      id: event.eventId,
      summary: event.summary,
      description: event.description,
      start: { dateTime: event.startTime.toISOString() },
      end: { dateTime: event.endTime.toISOString() },
      location: event.location,
      emotion: event.emotion,
    }));
    return {
      message: 'DB에 저장된 캘린더 이벤트 조회 성공',
      events,
    };
  }

  @Patch('event-emotion')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '캘린더 이벤트에 감정 할당' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        eventId: { type: 'string', example: 'abc123' },
        emotion: { type: 'string', example: '행복' },
      },
      required: ['eventId', 'emotion'],
    },
  })
  @ApiResponse({
    status: 200,
    description: '감정 할당 성공',
    schema: { example: { success: true } },
  })
  async setEventEmotion(
    @Req() req,
    @Body() body: { eventId: string; emotion: string }
  ) {
    const { eventId, emotion } = body;
    return this.calendarService.setEventEmotion(
      eventId,
      req.user.userId,
      emotion
    );
  }
  @Patch('emotion')
  @UseGuards(JwtAuthGuard)
  async upsertEmotion(
    @Req() req,
    @Body() body: { day: string; emotion: string }
  ) {
    return this.calendarService.upsertEmotion(
      req.user.userId,
      body.day,
      body.emotion
    );
  }

  @Get('emotions')
  @UseGuards(JwtAuthGuard)
  async getEmotionsByMonth(@Req() req, @Query('month') month: string) {
    return this.calendarService.getEmotionsByMonth(req.user.userId, month);
  }
}
