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
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

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
        timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30일 후까지
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime',
      });

      // DB에 이벤트 저장
      await this.saveEventsToDB(userId, response.data.items);

      return response.data.items;
    } catch (error) {
      if (error.response?.status === 401) {
        // 토큰이 만료된 경우 리프레시 토큰으로 갱신
        await this.refreshGoogleToken(userId);
        return this.getCalendarEvents(userId);
      }
      throw new HttpException(
        '캘린더 정보를 가져오는데 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
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

  private async refreshGoogleToken(userId: number, retryCount = 0) {
    if (retryCount >= 3) {
      throw new HttpException(
        '최대 재시도 횟수 초과',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.googleRefreshToken) {
      throw new HttpException(
        '리프레시 토큰이 없습니다.',
        HttpStatus.UNAUTHORIZED
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    try {
      oauth2Client.setCredentials({
        refresh_token: user.googleRefreshToken,
      });
      const { credentials } = await oauth2Client.refreshAccessToken();

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: credentials.access_token,
          googleRefreshToken:
            credentials.refresh_token || user.googleRefreshToken,
          googleTokenExpiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        },
      });
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      throw new HttpException(
        '토큰 갱신에 실패했습니다.',
        HttpStatus.UNAUTHORIZED
      );
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
