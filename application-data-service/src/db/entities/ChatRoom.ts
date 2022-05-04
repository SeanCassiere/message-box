import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("chat_room")
export default class ChatRoom extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "room_id" })
  roomId: number;

  @Column("text", { name: "client_id" })
  clientId: string;

  @Column("text", { name: "room_name" })
  roomName: string;

  @Column("bool", { name: "is_deleted", default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
