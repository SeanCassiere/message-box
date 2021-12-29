import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("roles")
export default class Role extends BaseEntity {
	@PrimaryGeneratedColumn("uuid", { name: "role_id" })
	roleId: string;

	@Column("text", { name: "client_id" })
	clientId: string;

	@Column("text", { name: "root_name" })
	rootName: string;

	@Column("text", { name: "view_name" })
	viewName: string;

	@Column("bool", { name: "is_active", default: true })
	isActive: boolean;

	@Column("bool", { name: "is_user_deletable", default: true })
	isUserDeletable: boolean;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
	createdAt: Date;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", name: "updated_at" })
	updatedAt: Date;
}
