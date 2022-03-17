import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";

@Entity("calendar_event")
export default class CalendarEvent extends BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "event_id" })
  eventId: string;

  @Column("text", { name: "client_id" })
  clientId: string;

  @Column("text", { name: "owner_id" })
  ownerId: string;

  @Column("text", { name: "title" })
  title: string;

  @Column("text", { name: "description", default: "" })
  description: string;

  @Column("timestamptz", { name: "start_date" })
  startDate: Date;

  @Column("timestamptz", { name: "end_date" })
  endDate: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @VersionColumn({ default: 1 })
  version: number;
}
