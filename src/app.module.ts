import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { ConfigModule } from './config.module';
import { MessageModule } from './message/message.module';
import { SocketModule } from './socket/socket.module';

@Module({
	imports: [ConfigModule, SocketModule, MessageModule],
	controllers: [AppController],
	providers: [AppGateway],
})
export class AppModule {}
