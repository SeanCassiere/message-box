import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn } from "typeorm";

@Entity("activity_log")
export default class ActivityLog extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "id" })
  id: number;

  @Column("text", { name: "client_id" })
  clientId: string;

  @Column("text", { name: "user_id" })
  userId: string;

  @Column("text", { name: "action" })
  action: string;

  @Column("text", { name: "description", default: "" })
  description: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
