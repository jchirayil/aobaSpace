import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { Organization } from "../../users/entities/organization.entity";
import { Plan } from "./plan.entity";
import { PaymentProfile } from "./payment_profile.entity";

export enum SubscriptionStatus {
  TRIALING = "trialing",
  ACTIVE = "active",
  PAST_DUE = "past_due",
  CANCELED = "canceled",
  INCOMPLETE = "incomplete", // For when payment fails on creation
}

@Entity("subscriptions")
export class Subscription {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  organizationId: string;

  // A subscription belongs to one organization. An organization can have only one active subscription.
  @OneToOne(() => Organization, (organization) => organization.subscription, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "organizationId" })
  organization: Organization;

  @Column()
  planId: string;

  @ManyToOne(() => Plan, (plan) => plan.subscriptions, { eager: true }) // Eager load plan details
  @JoinColumn({ name: "planId" })
  plan: Plan;

  @Column({ nullable: true })
  paymentProfileId: string;

  @ManyToOne(() => PaymentProfile, (profile) => profile.subscriptions)
  @JoinColumn({ name: "paymentProfileId" })
  paymentProfile: PaymentProfile;

  @Column({
    type: "enum",
    enum: SubscriptionStatus,
    default: SubscriptionStatus.TRIALING,
  })
  status: SubscriptionStatus;

  @Column({ type: "timestamp with time zone" })
  currentPeriodStart: Date;

  @Column({ type: "timestamp with time zone" })
  currentPeriodEnd: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
