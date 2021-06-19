import path from 'path';
import readdir from 'recursive-readdir';

// eslint-disable-next-line @typescript-eslint/ban-types
type ClassDescriptor = Function & { prototype: Function['prototype'] };

type Ctor<T> = { new (): T };

export class ClassContainer<T extends ClassDescriptor> {
	readonly type: T;
	readonly dirPaths: readonly string[];

	#classes?: Ctor<T>[];

	constructor(type: T, ...dirPaths: string[]) {
		this.type = type;
		this.dirPaths = dirPaths;
	}

	async getClasses() {
		if (!this.#classes) {
			this.#classes = await this.loadDirs();
		}

		return this.#classes;
	}

	private initializeClass(c: Ctor<T>): T['prototype'] {
		return new c();
	}

	async getInstances() {
		const classes = await this.getClasses();

		return classes.map((c) => this.initializeClass(c));
	}

	async getDetailedInstances() {
		const classes = await this.getClasses();

		return classes.map((c) => ({
			name: c.name,
			instance: this.initializeClass(c),
		}));
	}

	/**
	 * @param dirPath Path to the directory that contains the classes.
	 * The path is resolved using Node's `path.resolve()` function.
	 */
	protected async loadClassesFromDir(dirPath: string, type: T): Promise<Ctor<T>[]> {
		const fullDirPath = path.resolve(dirPath);

		const filePaths = await readdir(fullDirPath, ['!*.+(ts|js)']);

		const defaultImports: unknown[] = await Promise.all(filePaths.map(async (filePath) => (await import(filePath)).default));

		const fixtureClasses = defaultImports.filter(<(c: unknown) => c is Ctor<T>>((fixtureInstance) => {
			return typeof fixtureInstance == 'function' && fixtureInstance.prototype instanceof type;
		}));

		return fixtureClasses;
	}

	protected async loadDirs(): Promise<Ctor<T>[]> {
		const dirsSubclasses = await Promise.all(this.dirPaths.map((dirPath) => this.loadClassesFromDir(dirPath, this.type)));

		const allSubclasses = ([] as Ctor<T>[]).concat(...dirsSubclasses);

		return allSubclasses;
	}
}

export default ClassContainer;
