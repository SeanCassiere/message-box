import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("chat_room_user_mappings")
export default class ChatRoomUserMapping extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "mapping_id" })
  mappingId: number;

  @Column("text", { name: "room_id" })
  roomId: string;

  @Column("text", { name: "user_id" })
  userId: string;

  @Column("bool", { name: "is_deleted", default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
