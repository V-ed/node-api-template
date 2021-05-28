import { IsEnum, IsNumber, IsString } from 'class-validator';

export enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test',
}

export const DEFAULT_PORT = 3000;

export class EnvironmentConfig {
	@IsEnum(Environment)
	readonly NODE_ENV: Environment = Environment.Development;

	@IsNumber()
	readonly PORT: number = DEFAULT_PORT;

	@IsString()
	readonly KEY!: string;

	@IsString()
	readonly DATABASE_URL!: string;
}
