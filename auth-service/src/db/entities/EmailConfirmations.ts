import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

type ConfirmationType = "account_confirmation" | "password_reset" | "lost_2fa_access";

@Entity("email_confirmations")
export default class EmailConfirmations extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "confirmation_id" })
  confirmationId: string;

  @Column("text", { name: "user_id" })
  userId: string;

  @Column("text", { name: "type" })
  type: ConfirmationType;

  @Column("text", { name: "is_used", default: false })
  is_used: boolean;

  @Column({ type: "timestamp", default: () => "NOW() + INTERVAL '90 day'", name: "expires_at" })
  expiresAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", name: "updated_at" })
  updatedAt: Date;
}
