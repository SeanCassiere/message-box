import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("team_mappings")
export default class TeamMapping extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "mapping_id" })
  mappingId: number;

  @Column("text", { name: "team_id" })
  teamId: string;

  @Column("text", { name: "user_id" })
  userId: string;

  @Column("bool", { name: "is_a_team_leader", default: false })
  isATeamLeader: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
