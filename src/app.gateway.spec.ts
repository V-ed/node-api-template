import { Test, TestingModule } from '@nestjs/testing';
import { AppGateway } from './app.gateway';
import { SocketModule } from './socket/socket.module';

describe('AppGateway', () => {
	let gateway: AppGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [SocketModule],
			providers: [AppGateway],
		}).compile();

		gateway = module.get<AppGateway>(AppGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
