import { PrismaService } from '$/prisma.service';
import { SocketModule } from '$/socket/socket.module';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';

describe('MessageGateway', () => {
	let gateway: MessageGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [SocketModule],
			providers: [MessageGateway, PrismaService, MessageService],
		}).compile();

		gateway = module.get<MessageGateway>(MessageGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
