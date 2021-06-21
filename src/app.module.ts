import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
// import { AppGateway } from './app.gateway';
import { AppController } from './app.controller';
import { ConfigModule } from './config.module';
import { MessageModule } from './message/message.module';
// import { SocketModule } from './socket/socket.module';
import { PubSub } from './pub-sub';

const isProd = process.env.NODE_ENV == 'production';

const graphqlModule = GraphQLModule.forRoot({
	autoSchemaFile: true,
	installSubscriptionHandlers: true,
	debug: !isProd,
	playground: !isProd,
});

@Module({
	imports: [
		graphqlModule,
		ConfigModule,
		// SocketModule,
		MessageModule,
	],
	controllers: [AppController],
	providers: [
		// AppGateway
		PubSub,
	],
})
export class AppModule {}
