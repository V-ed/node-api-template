import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Message extends BaseEntity<Message, 'id'> {
	@PrimaryKey()
	public id!: number;

	@Property()
	public username!: string;

	@Property()
	public message!: string;

	@Property()
	public time = new Date();
}
