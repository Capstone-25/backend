import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { google } from 'googleapis';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  private getGoogleCalendarClient(accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    return google.calendar({ version: 'v3', auth });
  }

  async getCalendarEvents(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      console.log(user.googleAccessToken);
      if (!user || !user.googleAccessToken) {
        throw new HttpException(
          '구글 캘린더 접근 권한이 없습니다.',
          HttpStatus.UNAUTHORIZED
        );
      }
      const calendar = this.getGoogleCalendarClient(user.googleAccessToken);
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime',
      });
      const items = response.data.items ?? [];
      await this.saveEventsToDB(userId, items);
      return items;
    } catch (error) {
      console.log(error);
      // if (error.response?.status === 401) {
      //   // refreshToken 없이 바로 에러 반환
      //   throw new HttpException(
      //     '구글 연동이 만료되었습니다. 다시 연동해주세요.',
      //     HttpStatus.UNAUTHORIZED
      //   );
      // }
      // throw new HttpException(
      //   '캘린더 정보를 가져오는데 실패했습니다.',
      //   HttpStatus.INTERNAL_SERVER_ERROR
      // );
    }
  }

  private async saveEventsToDB(userId: number, events: any[]) {
    for (const event of events) {
      const eventData = {
        eventId: event.id,
        summary: event.summary,
        description: event.description,
        startTime: new Date(event.start.dateTime || event.start.date),
        endTime: new Date(event.end.dateTime || event.end.date),
        location: event.location,
        userId: userId,
      };

      await this.prisma.calendarEvent.upsert({
        where: { eventId: event.id },
        update: {
          summary: eventData.summary,
          description: eventData.description,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          location: eventData.location,
        },
        create: eventData,
      });
    }
  }

  async setEventEmotion(
    eventId: string,
    userId: number,
    emotion: string
  ): Promise<any> {
    const event = await this.prisma.calendarEvent.findUnique({
      where: { eventId },
    });
    if (!event || event.userId !== userId)
      throw new Error('이벤트를 찾을 수 없거나 권한이 없습니다.');
    await this.prisma.calendarEvent.update({
      where: { eventId },
      data: { emotion },
    });
    return { success: true };
  }

  async getDbCalendarEvents(userId: number) {
    const events = await this.prisma.calendarEvent.findMany({
      where: { userId },
      orderBy: { startTime: 'asc' },
    });
    return events;
  }
}
