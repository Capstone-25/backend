import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@src/prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkScheduledNotifications() {
    const now = new Date();
    const notifications = await this.prisma.notificationSchedule.findMany({
      where: {
        scheduledTime: {
          lte: now,
        },
        isSent: false,
      },
    });

    for (const notification of notifications) {
      try {
        await this.notificationService.sendPushNotification(
          notification.userId,
          notification.title,
          notification.body
        );

        // 알림 전송 완료 표시
        await this.prisma.notificationSchedule.update({
          where: { id: notification.id },
          data: { isSent: true },
        });
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    }
  }

  onModuleInit() {
    // 초기화 시 필요한 작업이 있으면 여기에 작성
  }
}
