import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, env } from './config.module';
import { Environment } from './env.validation';
import { MessageModule } from './message/message.module';
import { PubSub } from './pub-sub';

const isProd = env.NODE_ENV == Environment.Production;

const graphqlModule = GraphQLModule.forRoot({
	autoSchemaFile: true,
	installSubscriptionHandlers: true,
	debug: !isProd,
	playground: !isProd,
});

@Module({
	imports: [graphqlModule, ConfigModule, MessageModule],
	providers: [PubSub],
})
export class AppModule {}
