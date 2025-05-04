import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async sendPushNotification(userId: number, title: string, body: string) {
    // 1. 사용자의 FCM 토큰 조회
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fcmToken: true },
    });

    if (!user?.fcmToken) return;

    // 2. 푸시 알림 전송
    await admin.messaging().send({
      token: user.fcmToken,
      notification: {
        title,
        body,
      },
      data: {
        type: 'calendar',
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
    });
  }

  async scheduleEventNotification(eventId: number) {
    // 1. 이벤트 정보 조회
    const event = await this.prisma.calendarEvent.findUnique({
      where: { id: eventId },
      include: { user: true },
    });

    if (!event) return;

    // 2. 24시간 전 시간 계산
    const notificationTime = new Date(event.startDate);
    notificationTime.setHours(notificationTime.getHours() - 24);

    // 3. 알림 스케줄링
    await this.prisma.notificationSchedule.create({
      data: {
        eventId,
        userId: event.userId,
        scheduledTime: notificationTime,
        title: '일정 알림',
        body: `${event.title} 일정이 24시간 후에 시작됩니다.`,
        isSent: false,
      },
    });
  }
} 