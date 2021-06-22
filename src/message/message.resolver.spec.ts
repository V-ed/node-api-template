import { PrismaService } from '$/prisma.service';
import { PubSub } from '$/pub-sub';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageResolver } from './message.resolver';

describe('MessageResolver', () => {
	let resolver: MessageResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MessageResolver, PrismaService, PubSub],
		}).compile();

		resolver = module.get<MessageResolver>(MessageResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
