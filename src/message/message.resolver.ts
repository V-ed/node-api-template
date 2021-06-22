import { PrismaService } from '$/prisma.service';
import { PubSub } from '$/pub-sub';
import { Message, MessageCreateInput, MessageUpdateWithWhereUniqueWithoutUserInput, MessageWhereInput } from '$prisma-graphql/message';
import { Args, Info, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from 'graphql';

@Resolver(() => Message)
export class MessageResolver {
	constructor(private prismaService: PrismaService, private pubSub: PubSub) {}

	@Query(() => [Message])
	async messages(@Args('where', { nullable: true }) where: MessageWhereInput, @Info() info: GraphQLResolveInfo) {
		const select = new PrismaSelect(info).value;

		const messages = await this.prismaService.message.findMany({ where, ...select });

		return messages;
	}

	@Mutation(() => Message, { nullable: true })
	async addMessage(@Args('data') data: MessageCreateInput, @Info() info: GraphQLResolveInfo) {
		const message = await this.pubSub.prismaMutate('messageAdded', info, (allSelect) => {
			return this.prismaService.message.create({ data, ...allSelect });
		});

		return message;
	}

	@Mutation(() => Message)
	async updateMessage(@Args('query') query: MessageUpdateWithWhereUniqueWithoutUserInput, @Info() info: GraphQLResolveInfo) {
		const select = new PrismaSelect(info).value;

		const where = query.where;
		const data = { time: new Date(), ...query.data };

		const updatedMessage = await this.prismaService.message.update({ where, data, ...select });

		return updatedMessage;
	}

	@Subscription(() => Message, { name: 'messageAdded' })
	subscribeMessageAdded(@Info() info: GraphQLResolveInfo) {
		return this.pubSub.prismaSubscribe('messageAdded', info);
	}
}
