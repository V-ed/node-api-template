import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';
// import { hashPassword } from "../utils/auth";

@Entity({
	name: 'users',
})
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({
		unique: true,
	})
	public username!: string;

	@Column()
	public firstName!: string;

	@Column()
	public lastName!: string;

	// @Column()
	// public password!: string;

	// public async setPassword(password: string): Promise<void | string> {
	//   try {
	//     this.password = await hashPassword(password);
	//     return;
	//   } catch (error) {
	//     return error;
	//   }
	// }

	public get fullname(): string {
		return `${this.firstName} ${this.lastName}`;
	}
}
