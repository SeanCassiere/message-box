import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";

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

  @Column("text", { name: "permissions", default: [], array: true })
  permissions: string[];

  @Column("bool", { name: "is_active", default: true })
  isActive: boolean;

  @Column("bool", { name: "is_user_deletable", default: true })
  isUserDeletable: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @VersionColumn({ default: 1 })
  version: number;
}
