import { Module } from '@nestjs/common';
import { dotenvLoader, TypedConfigModule } from 'nest-typed-config';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { EnvironmentConfig } from './env.validation';
import { MessageModule } from './message/message.module';
import { SocketModule } from './socket/socket.module';

@Module({
	imports: [
		TypedConfigModule.forRoot({
			isGlobal: true,
			schema: EnvironmentConfig,
			load: dotenvLoader(),
		}),
		SocketModule,
		MessageModule,
	],
	controllers: [AppController],
	providers: [AppGateway],
})
export class AppModule {}
