import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // 테스트용 푸시 알림 전송
  @Post('test')
  async sendTest(@Body('userId') userId: number) {
    return await this.notificationService.sendTestNotification(userId);
  }
}
