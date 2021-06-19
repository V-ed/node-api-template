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
