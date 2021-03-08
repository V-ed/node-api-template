import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { MessageModule } from './message/message.module';
import { SocketModule } from './socket/socket.module';

@Module({
	imports: [SocketModule, MessageModule],
	controllers: [AppController],
	providers: [AppGateway],
})
export class AppModule {}
