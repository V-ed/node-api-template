import { ConfigModule } from '$common/configs/config.module';
import { PrismaModule } from '$common/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { GraphQLModule } from './graphql.module';
import { MessageModule } from './message/message.module';

@Module({
	imports: [ConfigModule, PrismaModule, GraphQLModule, MessageModule],
	providers: [],
})
export class AppModule {}
