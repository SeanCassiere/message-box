import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("clients")
export default class Client extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "client_id" })
  clientId: string;

  @Column("text", { name: "admin_user_id", nullable: true })
  adminUserId: string;

  @Column()
  name: string;

  @Column("bool", { name: "is_active", default: true })
  isActive: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", name: "updated_at" })
  updatedAt: Date;
}
