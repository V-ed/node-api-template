import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
	name: 'messages',
})
export class Message extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column()
	public username!: string;

	@Column()
	public message!: string;

	@Column({ type: 'time', default: () => `datetime('now', 'localtime')` })
	public time!: string;
}

export default Message;
