import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { ChatModule } from './modules/chat/chat.module';
import { UserModule } from './modules/users/user.module';
import { FirebaseModule } from '@src/config/firebase.module';
import { NotificationModule } from '@src/modules/notification/notification.module';
import { SchedulerModule } from '@src/modules/scheduler/scheduler.module';
import { VoiceModule } from './modules/voice/voice.module';
import { SurveyModule } from './modules/surveys/survey.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 환경 변수를 글로벌하게 사용할 수 있도록 설정
    }),
    AuthModule,
    CalendarModule,
    ChatModule,
    UserModule,
    FirebaseModule,
    NotificationModule,
    SchedulerModule,
    VoiceModule,
    SurveyModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
