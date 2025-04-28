import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import * as fileType from 'file-type';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}
}
