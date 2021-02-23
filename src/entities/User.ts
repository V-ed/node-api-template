import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';
// import { hashPassword } from "../utils/auth";

@Entity()
export class User extends BaseEntity<User, 'id'> {
	@PrimaryKey()
	public id!: number;

	@Property({
		unique: true,
	})
	public username!: string;

	@Property()
	public firstName!: string;

	@Property()
	public lastName!: string;

	// @Property()
	// public password!: string;

	// public async setPassword(password: string): Promise<void | string> {
	// 	this.password = await hashPassword(password);
	// }

	public get fullname(): string {
		return `${this.firstName} ${this.lastName}`;
	}
}
