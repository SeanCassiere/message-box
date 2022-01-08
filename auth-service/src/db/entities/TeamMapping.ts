import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("team_mappings")
export default class TeamMapping extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "mapping_id" })
  mappingId: number;

  @Column("text", { name: "team_id" })
  teamId: string;

  @Column("text", { name: "user_id" })
  userId: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", name: "updated_at" })
  updatedAt: Date;
}
