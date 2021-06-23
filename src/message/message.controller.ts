import { PrismaService } from '$/prisma.service';
import { Controller } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
	constructor(private readonly prisma: PrismaService, private readonly messageService: MessageService) {}
}
