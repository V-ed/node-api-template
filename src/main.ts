import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './socket/SocketIoAdapter';

const DEFAULT_PORT = 3000;

const PORT = process.env.PORT || DEFAULT_PORT;

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });

	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	// TODO : Remove Socket.IO v3 custom adapter once Nest supports it
	app.useWebSocketAdapter(new SocketIoAdapter(app));

	await app.listen(PORT);

	console.log(`Server launched on port ${PORT}!`);
}

bootstrap();
