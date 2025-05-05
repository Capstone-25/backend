import { Controller, Get, UseGuards, Req, Post } from '@nestjs/common';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
import { CalendarService } from './calendar.service';
import { ApiTags } from '@nestjs/swagger';
import { CalendarSwagger } from './swagger/calendar.swagger';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  @UseGuards(JwtAuthGuard)
  @CalendarSwagger.getCalendarEvents.operation
  @CalendarSwagger.getCalendarEvents.response
  async getCalendarEvents(@Req() req) {
    const userId = req.user.userId;
    const events = await this.calendarService.getCalendarEvents(userId);
    return {
      message: '캘린더 이벤트 조회 성공',
      events,
    };
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  async syncGoogleCalendar(@Req() req) {
    const userId = req.user.userId;
    console.log(userId);
    const events = await this.calendarService.getCalendarEvents(userId);
    return {
      message: '구글 캘린더 연동 성공',
      events,
    };
  }
}
