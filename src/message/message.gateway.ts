import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import type { CreateMessageDto } from './dto/create-message.dto';
import type { IUserMessage } from './interfaces/message.interface';
import { MessageService } from './message.service';

@WebSocketGateway()
export class MessageGateway {
	constructor(private readonly messageService: MessageService) {}

	@SubscribeMessage('send_message')
	handleMessage(@MessageBody() data: CreateMessageDto): Promise<IUserMessage> {
		return this.messageService.createMessage(data);
	}
}
