import { PrismaService } from '$/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
	constructor(private readonly prisma: PrismaService) {}
}
