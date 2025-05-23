import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from '@src/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { NotificationModule } from '@src/modules/notification/notification.module';
@Module({
  imports: [HttpModule, NotificationModule],
  controllers: [ChatController],
  providers: [ChatService, PrismaService],
})
export class ChatModule {}
