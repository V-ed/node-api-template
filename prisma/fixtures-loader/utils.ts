import { Range } from './fixture';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaCreateDataArgType = { data: any };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaCreateReturnType = PromiseLike<any>;

type PrismaCreator = (args: PrismaCreateDataArgType) => PrismaCreateReturnType;

type InferredGeneric<R> = R extends PromiseLike<infer T> ? T : never;

type DataSpecifier<F extends PrismaCreator> = Parameters<F>[0]['data'];

type DataSpecifierMapped<F extends PrismaCreator> = (current: number) => DataSpecifier<F>;

export async function createMany<F extends PrismaCreator>(
	fn: F,
	...dataSpecifiers: (DataSpecifier<F> | DataSpecifierMapped<F>)[]
): Promise<InferredGeneric<ReturnType<F>>[]> {
	const models = dataSpecifiers.map((dataSpecifier, index) => {
		const data =
			typeof dataSpecifier == 'function' ? (dataSpecifier as (current: number) => Parameters<F>[0]['data'])(index) : dataSpecifier;

		return fn({ data });
	});

	return Promise.all(models);
}

export async function createRange<F extends PrismaCreator>(
	fn: F,
	range: number | Range,
	dataCreator: DataSpecifierMapped<F>,
): Promise<InferredGeneric<ReturnType<F>>[]> {
	function getCountAndDelta(): { count: number; delta: number } {
		if (typeof range == 'number') {
			return { count: range, delta: 1 };
		}

		if (range.from <= 0) {
			throw `The 'from' range option must be bigger than 0! Given : '${range.from}'`;
		}
		if (range.from > range.to) {
			throw `The 'from' range option must be less or equal to the 'to' range option! From : '${range.from}', To : '${range.to}'`;
		}

		return { count: range.to - range.from, delta: range.from };
	}

	const { count, delta } = getCountAndDelta();

	const models = Array.from(Array(count).keys())
		.map((index) => dataCreator(index + delta))
		.map((dataSpecifier) => fn({ data: dataSpecifier }));

	return Promise.all(models);
}
