import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("two_factor_auth_mappings")
export default class TwoFactorAuthMapping extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "mapping_id" })
  mappingId: number;

  @Column("text", { name: "user_id" })
  userId: string;

  @Column("text", { name: "secret" })
  secret: string;

  @Column("text", { name: "is_temp", default: true })
  is_temp: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
