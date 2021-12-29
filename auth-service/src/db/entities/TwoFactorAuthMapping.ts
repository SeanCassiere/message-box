import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("two_factor_auth_mappings")
export default class TwoFactorAuthMapping extends BaseEntity {
	@PrimaryGeneratedColumn("increment", { name: "mapping_id" })
	mappingId: number;

	@Column("text", { name: "user_id" })
	userId: string;

	@Column("text", { name: "secret" })
	secret: string;

	@Column("text", { name: "is_temp", default: true })
	is_temp: boolean;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
	createdAt: Date;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", name: "updated_at" })
	updatedAt: Date;
}
