import { Module } from '@nestjs/common';
import { ConfigModule } from './configs/config.module';
import { GraphQLModule } from './graphql.module';
import { MessageModule } from './message/message.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [ConfigModule, PrismaModule, GraphQLModule, MessageModule],
	providers: [],
})
export class AppModule {}
