import { Message, MessageCreateInput, MessageUpdateWithWhereUniqueWithoutUserInput, MessageWhereInput } from '$prisma-graphql/message';
import { Args, Info, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { MessageService } from './message.service';

@Resolver(() => Message)
export class MessageResolver {
	constructor(private messageService: MessageService) {}

	@Query(() => [Message])
	messages(@Args('where', { nullable: true }) where: MessageWhereInput, @Info() info: GraphQLResolveInfo) {
		return this.messageService.find(info, where);
	}

	@Mutation(() => Message, { nullable: true })
	addMessage(@Args('data') data: MessageCreateInput, @Info() info: GraphQLResolveInfo) {
		return this.messageService.create(info, data);
	}

	@Mutation(() => Message)
	updateMessage(@Args('query') query: MessageUpdateWithWhereUniqueWithoutUserInput, @Info() info: GraphQLResolveInfo) {
		return this.messageService.update(info, query);
	}

	@Subscription(() => Message, { name: 'messageAdded' })
	subscribeMessageAdded(@Info() info: GraphQLResolveInfo) {
		return this.messageService.subscribeAdded(info);
	}
}
