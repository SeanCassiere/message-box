import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { v4 } from "uuid";

import { addMinsToCurrentDate } from "#root/util/addMinsToCurrentDate";

@Entity("user_tokens")
export default class Token extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "token_id" })
  tokenId: number;

  @Column("text", { name: "user_id" })
  userId: string;

  @Column("text", { name: "token" })
  token: string;

  @Column("text", { name: "token_type" })
  tokenType: "user_access_token" | "user_refresh_token";

  @Column("timestamptz", { name: "expires_at" })
  expiresAt: Date;

  @Column("bool", { name: "is_blocked", default: false })
  isBlocked: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  appendRefreshToken() {
    const refreshToken = v4();
    const expiresAt = addMinsToCurrentDate(60 * 9);
    this.token = refreshToken;
    this.tokenType = "user_refresh_token";
    this.expiresAt = expiresAt;
    return refreshToken;
  }
}
