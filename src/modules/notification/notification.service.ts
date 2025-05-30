import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async sendPushNotification(userId: number, title: string, body: string) {
    // 1. 사용자의 FCM 토큰 조회
    console.log('userId', userId);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fcmToken: true },
    });

    if (!user?.fcmToken) return;

    // 2. 푸시 알림 전송
    try {
      const result = await admin.messaging().send({
        token: user.fcmToken,
        notification: {
          title,
          body,
        },
        data: {
          title,
          body,
        },
        webpush: {
          notification: {
            icon: '/assets/notification-icon.png',
            badge: '/assets/notification-badge.png',
            actions: [
              {
                action: 'open',
                title: '열기',
              },
            ],
          },
          fcmOptions: {
            link: 'https://sehxxnee.github.io/#/main', // 알림 클릭시 이동할 URL
          },
        },
      });
      console.log('푸시 알림 전송 결과:', result);
    } catch (error) {
      console.error('푸시 알림 전송 오류:', error);
    }
  }

  async scheduleEventNotification(eventId: number) {
    // 1. 이벤트 정보 조회
    const event = await this.prisma.calendarEvent.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        summary: true,
        startTime: true,
        userId: true,
        user: {
          select: {
            id: true,
            fcmToken: true,
          },
        },
      },
    });

    if (!event) return;

    // 2. 24시간 전 시간 계산
    const notificationTime = new Date(event.startTime);
    notificationTime.setHours(notificationTime.getHours() - 24);

    const exists = await this.prisma.notificationSchedule.findFirst({
      where: {
        eventId,
        userId: event.userId,
        scheduledTime: notificationTime,
      },
    });
    if (exists) return; // 이미 예약이 있으면 추가하지 않음

    // 3. 알림 스케줄링
    await this.prisma.notificationSchedule.create({
      data: {
        eventId,
        userId: event.userId,
        scheduledTime: notificationTime,
        title: '일정 알림',
        body: `${event.summary} 일정이 24시간 후에 시작됩니다. 이에 대해 토닥이와 대화해보세요!`,
        isSent: false,
      },
    });
  }

  // 테스트용 알림 전송
  async sendTestNotification(userId: number) {
    await this.sendPushNotification(
      userId,
      '일정 알림',
      '면접 일정이 24시간 후에 시작됩니다. 토닥이와 함께 이야기해보세요!'
    );
  }
}
