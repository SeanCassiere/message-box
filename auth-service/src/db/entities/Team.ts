import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";

@Entity("teams")
export default class Team extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "team_id" })
  teamId: string;

  @Column("text", { name: "client_id" })
  clientId: string;

  @Column("text", { name: "root_name" })
  rootName: string;

  @Column("text", { name: "team_name" })
  teamName: string;

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
