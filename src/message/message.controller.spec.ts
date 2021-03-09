import { PrismaService } from '$/prisma.service';
import { SocketModule } from '$/socket/socket.module';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

describe('MessageController', () => {
	let controller: MessageController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [SocketModule],
			controllers: [MessageController],
			providers: [PrismaService, MessageService],
		}).compile();

		controller = module.get<MessageController>(MessageController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
