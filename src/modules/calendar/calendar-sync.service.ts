import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@src/prisma/prisma.service';
import { CalendarService } from './calendar.service';

@Injectable()
export class CalendarSyncService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calendarService: CalendarService
  ) {}

  @Cron('* * * * *') // 1시간마다 실행
  async syncCalendars() {
    console.log('Cron 함수 실행');
    const users = await this.prisma.user.findMany({
      where: {
        googleAccessToken: { not: null },
        googleTokenExpiry: { gt: new Date() },
      },
    });

    for (const user of users) {
      try {
        await this.calendarService.getCalendarEvents(user.id);
      } catch (error) {
        console.error(`캘린더 동기화 실패 (userId: ${user.id}):`, error);
      }
    }
  }
}
