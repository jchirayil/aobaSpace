import { UserAccount } from "../../users/entities/user-account.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Subscription } from "./subscription.entity";

@Entity("payment_profiles")
export class PaymentProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userAccountId: string;

  @ManyToOne(() => UserAccount, (user) => user.paymentProfiles, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userAccountId" })
  userAccount: UserAccount;

  @Column()
  profileName: string; // e.g., "Company Visa", "Personal AMEX"

  @Column({ default: "stripe" })
  paymentProvider: string;

  @Column()
  providerPaymentMethodId: string; // This stores the specific payment method ID (e.g., Stripe's pm_...)

  @Column({ type: "jsonb", nullable: true })
  details: {
    brand: string; // e.g., 'visa', 'mastercard'
    last4: string;
    expMonth: number;
    expYear: number;
  };

  @OneToMany(() => Subscription, (subscription) => subscription.paymentProfile)
  subscriptions: Subscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
