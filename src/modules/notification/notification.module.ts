import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaModule } from '@src/prisma/prisma.module';
import { FirebaseModule } from '@src/config/firebase.module';

@Module({
  imports: [PrismaModule, FirebaseModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
