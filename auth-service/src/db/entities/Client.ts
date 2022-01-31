import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";

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

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @VersionColumn({ default: 1 })
  version: number;
}
