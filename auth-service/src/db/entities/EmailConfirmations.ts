import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
