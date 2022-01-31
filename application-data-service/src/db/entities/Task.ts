import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";

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

  @Column("timestamptz", { name: "completed_date", nullable: true })
  completedDate: Date;

  @Column("bool", { name: "is_completed", default: false })
  isCompleted: boolean;

  @Column("bool", { name: "is_deleted", default: false })
  isDeleted: boolean;

  @Column("text", { name: "client_id" })
  clientId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @VersionColumn({ default: 1 })
  version: number;
}
