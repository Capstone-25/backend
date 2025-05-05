import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
import { CalendarService } from './calendar.service';
import { CalendarEventsResponseDto } from './dto/calendar-event.dto';

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
    const events = await this.calendarService.getCalendarEvents(req.user.id);
    return {
      message: '구글 캘린더 연동 성공',
      events,
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
      req.user.id
    );
    const events = dbEvents.map(event => ({
      id: event.eventId,
      summary: event.summary,
      description: event.description,
      start: { dateTime: event.startTime.toISOString() },
      end: { dateTime: event.endTime.toISOString() },
      location: event.location,
    }));
    return {
      message: 'DB에 저장된 캘린더 이벤트 조회 성공',
      events,
    };
  }
}
