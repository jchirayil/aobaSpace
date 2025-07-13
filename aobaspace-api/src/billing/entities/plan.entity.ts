import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Subscription } from "./subscription.entity";

export enum BillingInterval {
  MONTH = "month",
  YEAR = "year",
}

@Entity("plans")
export class Plan {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string; // e.g., 'Pro Plan', 'Free Plan'

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  price: number;

  @Column({ default: "USD" })
  currency: string;

  @Column({
    type: "enum",
    enum: BillingInterval,
    default: BillingInterval.MONTH,
  })
  interval: BillingInterval;

  @Column({ nullable: true })
  description: string;

  // The date when the plan becomes available.
  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  // The date when the plan is no longer available for new subscriptions.
  // This should be set if isActive is false.
  @Column({ type: 'timestamp with time zone', nullable: true })
  endDate: Date | null;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];
}
