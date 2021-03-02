import type { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

export function validate(validations: readonly ValidationChain[]) {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		await Promise.all(validations.map((validation) => validation.run(req)));

		const errorsFound = validationResult(req);

		if (errorsFound.isEmpty()) {
			return next();
		}

		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		res.status(422).json({ validationErrors: errorsFound.array() });
	};
}
