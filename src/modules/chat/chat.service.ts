import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import * as fileType from 'file-type';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  // 온라인 유저 DB에 저장
  async addUserOnline(userId: number, clientId: string) {
    await this.prisma.online_users.create({
      data: {
        user_id: userId,
        client_id: clientId,
      },
    });
  }
}
