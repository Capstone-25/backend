import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { google } from 'googleapis';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async getCalendarEvents(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.googleAccessToken) {
        throw new HttpException(
          '구글 캘린더 접근 권한이 없습니다.',
          HttpStatus.UNAUTHORIZED
        );
      }

      // 1. OAuth 클라이언트 생성
      const authClient = this.createOAuthClient(user);

      // 2. 토큰 갱신 시도
      try {
        const { credentials } = await authClient.refreshAccessToken();
        console.log('[캘린더 연동] 토큰 갱신 성공:', credentials.access_token);

        // 3. DB에 새로운 토큰 저장
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            googleAccessToken: credentials.access_token,
            googleTokenExpiry: new Date(Date.now() + 1 * 60 * 60 * 1000),
          },
        });

        // 4. 새로운 토큰으로 credentials 설정
        authClient.setCredentials({
          access_token: credentials.access_token,
          refresh_token: user.googleRefreshToken,
          expiry_date: new Date(Date.now() + 1 * 60 * 60 * 1000).getTime(),
        });
      } catch (refreshError) {
        console.error('[캘린더 연동] 토큰 갱신 실패:', refreshError);
        throw new HttpException(
          '구글 연동이 만료되었습니다. 다시 연동해주세요.',
          HttpStatus.UNAUTHORIZED
        );
      }

      // 5. 캘린더 API 호출
      const calendar = google.calendar({ version: 'v3', auth: authClient });
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
      console.error('[캘린더 연동 에러]', error);
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

  private async refreshGoogleAccessToken(userId: number, isFirst: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (isFirst) {
      if (!user || !user.googleRefreshToken) {
        throw new HttpException(
          '구글 연동이 만료되었습니다. 다시 연동해주세요.',
          HttpStatus.UNAUTHORIZED
        );
      }
    }
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: user.googleRefreshToken });
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: credentials.access_token,
          googleRefreshToken:
            credentials.refresh_token || user.googleRefreshToken,
          googleTokenExpiry: new Date(Date.now() + 1 * 60 * 60 * 1000),
        },
      });
      console.log(
        '[캘린더 연동] accessToken 재발급 성공:',
        credentials.access_token
      );
    } catch (err) {
      console.error('[캘린더 연동] accessToken 재발급 실패:', err);
      throw new HttpException(
        '구글 연동이 만료되었습니다. 다시 연동해주세요.',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  private createOAuthClient(user: {
    googleAccessToken: string;
    googleRefreshToken?: string;
    googleTokenExpiry?: Date;
  }) {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    oAuth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
      expiry_date: user.googleTokenExpiry?.getTime(),
    });

    return oAuth2Client;
  }
}
