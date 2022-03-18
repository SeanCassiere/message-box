import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("calendar_event_share_mappings")
export default class CalendarEventShareMapping extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "mapping_id" })
  mappingId: number;

  @Column("text", { name: "event_id" })
  eventId: string;

  @Column("text", { name: "user_id" })
  userId: string;

  @Column("timestamptz", { name: "start_date" })
  startDate: Date;

  @Column("timestamptz", { name: "end_date" })
  endDate: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
