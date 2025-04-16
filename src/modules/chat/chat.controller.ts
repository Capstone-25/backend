import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';

@Controller('chat')
export class ChatController{
    constructor(private readonly chatService: ChatService) { }
    
}