import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentConfig } from './env.validation';
import { SocketIoAdapter } from './socket/SocketIoAdapter';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	app.enableCors({ origin: '*' });

	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	// TODO : Remove Socket.IO v3 custom adapter once Nest supports it
	app.useWebSocketAdapter(new SocketIoAdapter(app));

	const env = app.get(EnvironmentConfig);

	const port = env.PORT;

	await app.listen(port);

	console.log(`Server launched on port ${port}!`);
}

bootstrap();
