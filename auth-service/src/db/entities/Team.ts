import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("teams")
export default class Team extends BaseEntity {
	@PrimaryGeneratedColumn("uuid", { name: "team_id" })
	teamId: string;

	@Column("text", { name: "client_id" })
	clientId: string;

	@Column("text", { name: "root_name" })
	rootName: string;

	@Column("text", { name: "team_name" })
	teamName: string;

	@Column("bool", { name: "is_active", default: true })
	isActive: boolean;

	@Column("bool", { name: "is_user_deletable", default: true })
	isUserDeletable: boolean;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
	createdAt: Date;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", name: "updated_at" })
	updatedAt: Date;
}
