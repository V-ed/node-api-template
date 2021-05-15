import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
	@IsNotEmpty()
	username!: string;

	@IsNotEmpty()
	text!: string;
}
