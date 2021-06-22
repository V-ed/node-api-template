import { PrismaService } from '$/prisma.service';
import { PubSub } from '$/pub-sub';
import { Module } from '@nestjs/common';
// import { MessageController } from './message.controller';
// import { MessageGateway } from './message.gateway';
// import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';

@Module({
	// controllers: [MessageController],
	providers: [
		// MessageGateway,
		// MessageService,
		PrismaService,
		MessageResolver,
		PubSub,
	],
})
export class MessageModule {}
