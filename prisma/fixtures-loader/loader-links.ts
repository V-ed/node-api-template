/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import readdir from 'recursive-readdir';
import { Fixture } from './fixture';

export type Type<T> = new () => T;

type ClassType = Fixture<any>;

/**
 *
 * @param dirPath Path to the directory that contains the Fixture classes.
 * The path is resolved using Node's `path.resolve()` function.
 */
async function getFixtureClasses(dirPath: string): Promise<Type<ClassType>[]> {
	const fullDirPath = path.resolve(dirPath);

	const filePaths = await readdir(fullDirPath, ['!*.+(ts|js)']);

	const defaultImports: unknown[] = await Promise.all(filePaths.map(async (filePath) => (await import(filePath)).default));

	const fixtureClasses = defaultImports
		.filter((fixtureInstance) => {
			return typeof fixtureInstance == 'function' && fixtureInstance.prototype instanceof Fixture;
		})
		.map((fixtureInstance) => fixtureInstance as Type<ClassType>);

	return fixtureClasses;
}

export class ClassContainer {
	readonly links: ReadonlyMap<string, Type<ClassType>>;

	private constructor(classes: Type<ClassType>[]) {
		this.links = this.createFixturesMap(classes);
	}

	injectFixtures(...classes: Type<ClassType>[]): void {
		const fixtureMap = this.createFixturesMap(classes);

		fixtureMap.forEach((fixture, call) => {
			(this.links as Map<string, Type<ClassType>>).set(call, fixture);
		});
	}

	protected createFixturesMap(classes: Type<ClassType>[]) {
		const fixtureMap = new Map<string, Type<ClassType>>();

		const initFixture = (fixtureName: string, fixtureClass: Type<ClassType>): void => {
			fixtureMap.set(fixtureName, fixtureClass);
		};

		classes.forEach((fixtureClass) => {
			try {
				const name = fixtureClass.name;

				initFixture(name, fixtureClass);
			} catch {
				// Simply skip abstract / unformed Fixture classes
			}
		});

		return fixtureMap;
	}

	/**
	 *
	 * @param dirPath The path of the folder (relative or absolute) generate the links from.
	 * @param additionalClasses Any additional folders / `Fixture` classes to add to the container.
	 */
	static async createFromDir(dirPath: string, additionalClasses?: (Type<ClassType> | string)[]): Promise<ClassContainer> {
		const fixtureTypes: Type<ClassType>[] = [];

		fixtureTypes.push(...(await getFixtureClasses(dirPath)));

		if (additionalClasses) {
			const additionalFixtureTypesArray = await Promise.all(
				additionalClasses.map(async (additionalClass) => {
					if (typeof additionalClass == 'string') {
						return await getFixtureClasses(additionalClass);
					} else {
						return new Array(additionalClass);
					}
				}),
			);

			additionalFixtureTypesArray.forEach((additionalFixtureTypes) => fixtureTypes.push(...additionalFixtureTypes));
		}

		return new this(fixtureTypes);
	}

	static async createFromClasses(classes: Type<ClassType>[]) {
		return new this(classes);
	}
}

export default ClassContainer;
