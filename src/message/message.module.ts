import { PrismaService } from '$/prisma.service';
import { PubSub } from '$/pub-sub';
import { Module } from '@nestjs/common';
import { MessageResolver } from './message.resolver';

@Module({
	providers: [PrismaService, MessageResolver, PubSub],
})
export class MessageModule {}
