import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("task_share_mappings")
export default class TaskShareMapping extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "mapping_id" })
  mappingId: number;

  @Column("text", { name: "task_id" })
  taskId: string;

  @Column("text", { name: "user_id" })
  userId: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", name: "updated_at" })
  updatedAt: Date;
}
