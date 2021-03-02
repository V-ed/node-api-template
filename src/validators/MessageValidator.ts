import { check, ValidationChain } from 'express-validator';

export const messageChain: readonly ValidationChain[] = [
	check('username').notEmpty().withMessage(`Le nom d'utilisateur de doit pas être vide.`),
	check('message')
		.notEmpty()
		.withMessage((_value, meta) => (meta.req.params?.lang == 'en' ? 'The message cannot be empty.' : 'Le message ne doit pas être vide.')),
];
