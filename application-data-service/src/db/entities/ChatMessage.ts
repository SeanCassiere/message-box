import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity("chat_message")
export default class ChatMessage extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "message_id" })
  messageId: number;

  @Column("text", { name: "room_id" })
  roomId: string;

  @Column("text", { name: "client_id" })
  clientId: string;

  @Column("text", { name: "sender_id" })
  senderId: string;

  @Column("text", { name: "content_type" })
  contentType: string;

  @Column("text", { name: "content", default: 'text/text' })
  content: string;

  @Column("bool", { name: "is_deleted", default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: "created_at" })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
