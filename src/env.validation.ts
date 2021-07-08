import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test',
}

export const DEFAULT_PORT = 3000;

export const DEFAULT_GRAPHQL_DEPTH_LIMIT = 10;

export class EnvironmentConfig {
	@IsEnum(Environment)
	readonly NODE_ENV: Environment = Environment.Development;

	@Type(() => Number)
	@IsNumber()
	readonly PORT: number = DEFAULT_PORT;

	@Type(() => Number)
	@IsNumber()
	readonly GRAPHQL_DEPTH_LIMIT: number = DEFAULT_GRAPHQL_DEPTH_LIMIT;

	@IsString()
	readonly KEY!: string;

	@IsString()
	readonly DATABASE_URL!: string;
}
