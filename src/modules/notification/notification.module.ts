import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaModule } from '@src/prisma/prisma.module';
import { FirebaseModule } from '@src/config/firebase.module';
import { NotificationController } from './notification.controller';
@Module({
  imports: [PrismaModule, FirebaseModule],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
