import { PrismaClient } from '@prisma/client';

// Utility types
export type IdentityModel = { id: number };

export type ModelDependency<T extends IdentityModel> = { new (): Fixture<T> };

export type Dependency = ModelDependency<IdentityModel>;

type ModelType<T extends ModelDependency<IdentityModel>> = T extends ModelDependency<infer Model> ? Model : never;

type DepsData<Deps extends Dependency[]> = Record<string, ModelType<Deps[number]>[]>;

export type LinkMethod<F extends Fixture> = (
	dependency: F['dependencies'][number],
	_option: number | Range | LinkMode,
) => ModelType<typeof dependency>;

// Linking option types
export type Range = { from: number; to: number };

export enum LinkMode {
	RANDOM,
}

// Fixture class
export abstract class Fixture<T extends IdentityModel = IdentityModel> {
	abstract readonly dependencies: Dependency[];

	seedData?: T[];
	#dependenciesData?: DepsData<this['dependencies']>;

	setDependencyData(data: DepsData<this['dependencies']>) {
		this.#dependenciesData = data;
	}

	link(dependency: this['dependencies'][number], _option: number | Range | LinkMode): ModelType<typeof dependency> {
		const data = this.#dependenciesData?.[dependency.name];

		if (!data) {
			throw 'Data missing!';
		}

		const test = data[0];

		return test;
	}

	abstract seed(prisma: PrismaClient, link: LinkMethod<this>): Promise<T[]>;
}
