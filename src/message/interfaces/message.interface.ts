import type { User } from '@prisma/client';

export type IUserMessage = {
	user: User;
	message: string;
};
