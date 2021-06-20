import { PrismaClient } from '@prisma/client';

// Utility types
export type IdentityModel = { id: number };

export type ModelDependency<T extends IdentityModel> = { new (): Fixture<T> };

export type Dependency = ModelDependency<IdentityModel>;

type ModelType<T extends ModelDependency<IdentityModel>> = T extends ModelDependency<infer Model> ? Model : never;

export type LinkMethod<F extends Fixture> = (
	dependency: F['dependencies'][number],
	option: number | Range | LinkMode,
) => ModelType<typeof dependency>;

// Linking option types
export type Range = { from: number; to: number };

export enum LinkMode {
	RANDOM = 'RANDOM',
}

// Fixture class
export abstract class Fixture<T extends IdentityModel = IdentityModel> {
	abstract readonly dependencies: Dependency[];

	abstract seed(prisma: PrismaClient, link: LinkMethod<this>): Promise<T[]>;
}
