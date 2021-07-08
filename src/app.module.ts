import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import depthLimit from 'graphql-depth-limit';
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
	validationRules: [depthLimit(env.GRAPHQL_DEPTH_LIMIT)],
});

@Module({
	imports: [graphqlModule, ConfigModule, MessageModule],
	providers: [PubSub],
})
export class AppModule {}
