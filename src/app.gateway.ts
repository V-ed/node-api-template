import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket/socket.service';

@WebSocketGateway(undefined, { transports: ['websocket', 'polling'] })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server!: Server;

	private logger: Logger = new Logger(AppGateway.name);

	constructor(private socketService: SocketService) {}

	afterInit(server: Server): void {
		this.socketService.server = server;
	}

	handleDisconnect(client: Socket): void {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket): void {
		this.logger.log(`Client connected: ${client.id}`);
	}
}
