import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("users")
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "user_id" })
  userId: string;

  @Column("text", { name: "client_id" })
  clientId: string;

  @Column("text", { name: "email" })
  email: string;

  @Column()
  password: string;

  @Column("text", { name: "first_name", default: "" })
  firstName: string;

  @Column("text", { name: "last_name", default: "" })
  lastName: string;

  @Column("bool", { name: "is_active", default: true })
  isActive: boolean;

  @Column("bool", { name: "is_2fa_active", default: false })
  is2faActive: boolean;

  @Column("bool", { name: "is_email_confirmed", default: false })
  isEmailConfirmed: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", name: "updated_at" })
  updatedAt: Date;
}
