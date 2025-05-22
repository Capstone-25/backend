import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { webcrypto } from 'crypto';

if (typeof (globalThis as any).crypto === 'undefined') {
  // @ts-expect-error polyfill for Node<20
  globalThis.crypto = webcrypto;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://test-sso.online',
      'https://sehxxnee.github.io/',
    ],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  // 쿠키 파서 적용
  app.use(cookieParser.default());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Capstone API')
    .setDescription('Capstone을 위한 REST API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth() // JWT 인증 추가
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      url: '/api-docs', // Swagger 문서 경로와 맞추기 위해 설정
    },
    customSiteTitle: 'API 문서',
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
