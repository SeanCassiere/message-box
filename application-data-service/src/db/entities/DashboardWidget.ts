import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

export type ConfigDTO = {
  parameter: string;
  value: string;
};

export type VariableConfigDTO = {
  parameter: string;
  mode: string;
};

@Entity("dashboard_widget")
export default class DashboardWidget extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { name: "id" })
  id: number;

  @Column("text", { name: "client_id" })
  clientId: string;

  @Column("text", { name: "user_id" })
  userId: string;

  @Column("text", { name: "for_client", default: "web-client" })
  forClient: string;

  @Column("text", { name: "type" })
  type: string;

  @Column("text", { name: "name" })
  name: string;

  @Column()
  scale: number;

  @Column("bool", { name: "is_tall", default: false })
  isTall: boolean;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column("jsonb", { array: false, nullable: false, default: () => "'[]'" })
  config: ConfigDTO[];

  @Column("text", { array: false, nullable: false, name: "variable_config_options", default: () => "'[]'" })
  variableConfigOptions: VariableConfigDTO[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
