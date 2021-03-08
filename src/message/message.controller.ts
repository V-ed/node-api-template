import { PrismaService } from '$/prisma.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { Message, User } from '@prisma/client';
import { CreateMessageDto } from './dto/create-message.dto';
import type { IUserMessage } from './interfaces/message.interface';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
	constructor(private readonly prisma: PrismaService, private readonly messageService: MessageService) {}

	@Get()
	async getAll(): Promise<(Message & { user: User })[]> {
		return this.prisma.message.findMany({ include: { user: true } });
	}

	@Get(':id')
	async getOne(@Param('id') id: number): Promise<Message | null> {
		return this.prisma.message.findFirst({ where: { id } });
	}

	@Post()
	async createMessage(@Body() messageData: CreateMessageDto): Promise<IUserMessage> {
		return this.messageService.createMessage(messageData);
	}
}
