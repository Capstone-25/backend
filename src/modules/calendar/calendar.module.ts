import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { PrismaService } from '@src/prisma/prisma.service';
import { CalendarSyncService } from './calendar-sync.service';
import { NotificationModule } from '../notification/notification.module';
@Module({
  imports: [NotificationModule],
  controllers: [CalendarController],
  providers: [CalendarService, PrismaService, CalendarSyncService],
  exports: [CalendarService],
})
export class CalendarModule {}
