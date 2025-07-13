import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm"; // Removed JoinColumn from here
import { UserProfile } from "./user-profile.entity"; // NEW: Import UserProfile
import { UserPassword } from "./user-password.entity"; // NEW: Import UserPassword
import { UserOrganization } from "./user-organization.entity"; // NEW: Import UserOrganization
import { PaymentProfile } from "../../billing/entities/payment-profile.entity";

@Entity("user_accounts")
export class UserAccount {
  @PrimaryColumn({ length: 10 }) // Fixed length for user ID (e.g., 'abc123defg')
  id: string;

  @Column({ unique: true })
  username: string; // Can be email or a chosen username

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  ssoProvider?: string;

  @Column({ nullable: true })
  ssoId?: string;

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ type: "timestamp", nullable: true }) // Timestamp when the account was enabled
  enabledFromDate?: Date;

  @Column({ type: "timestamp", nullable: true }) // Timestamp when the account was disabled
  disabledOnDate?: Date;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  // Relationships - Foreign keys are now defined on the *other* side (UserProfile, UserPassword)
  @OneToOne(() => UserProfile, (userProfile) => userProfile.userAccount, {
    cascade: true,
  })
  profile: UserProfile;

  @OneToOne(() => UserPassword, (userPassword) => userPassword.userAccount, {
    cascade: true,
  })
  password: UserPassword;

  @OneToMany(
    () => UserOrganization,
    (userOrganization) => userOrganization.userAccount
  )
  userOrganizations: UserOrganization[];

  @OneToMany(() => PaymentProfile, (profile) => profile.userAccount)
  paymentProfiles: PaymentProfile[];
}
