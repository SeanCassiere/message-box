import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("tasks")
export default class Task extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "task_id" })
  taskId: string;

  @Column("text", { name: "owner_id" })
  ownerId: string;

  @Column("text", { name: "title" })
  title: string;

  @Column("text", { name: "content", default: "" })
  content: string;

  @Column("text", { name: "bg_color", default: "#009688" })
  bgColor: string;

  @Column("timestamptz", { name: "due_date" })
  dueDate: Date;

  @Column("bool", { name: "is_completed", default: false })
  isCompleted: boolean;

  @Column("bool", { name: "is_deleted", default: false })
  isDeleted: boolean;

  @Column("text", { name: "client_id" })
  clientId: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", name: "updated_at" })
  updatedAt: Date;
}
