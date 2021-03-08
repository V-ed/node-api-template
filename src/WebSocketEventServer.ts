import WebSocket from 'ws';

export class EventServer extends WebSocket.Server {
	emit(event: string | symbol, data: unknown): boolean {
		return super.emit(event, data);
	}
}

const wss = new WebSocket.Server();

wss.emit('');

const test = new EventServer();

test.emit('', 'test');

// test
