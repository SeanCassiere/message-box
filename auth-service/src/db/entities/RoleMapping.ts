import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("role_mappings")
export default class Role extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "mapping_id" })
  mappingId: number;

  @Column("text", { name: "role_id" })
  roleId: string;

  @Column("text", { name: "user_id" })
  userId: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", name: "updated_at" })
  updatedAt: Date;
}
