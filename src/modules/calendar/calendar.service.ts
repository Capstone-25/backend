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
        maxResults: 10,
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
      const startDate = event.start.dateTime || event.start.date;
      const endDate = event.end.dateTime || event.end.date;

      await this.prisma.calendarEvent.upsert({
        where: {
          googleEventId: event.id,
        },
        update: {
          title: event.summary,
          description: event.description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          location: event.location,
          isAllDay: !event.start.dateTime,
          lastSynced: new Date(),
        },
        create: {
          userId,
          googleEventId: event.id,
          title: event.summary,
          description: event.description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          location: event.location,
          isAllDay: !event.start.dateTime,
          lastSynced: new Date(),
        },
      });
    }
  }

  private async refreshGoogleToken(userId: number) {
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
      const { token } = await oauth2Client.getAccessToken();

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: token,
          googleTokenExpiry: new Date(
            Date.now() + 3600000 // 1시간
          ),
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
}
