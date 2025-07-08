import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserProfile } from './user_profile.entity'; // NEW: Import UserProfile
import { UserPassword } from './user_password.entity'; // NEW: Import UserPassword
import { UserOrganization } from './user_organization.entity'; // NEW: Import UserOrganization

@Entity('user_accounts')
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

  @Column({ type: 'timestamp', nullable: true }) // Timestamp when the account was enabled
  enabledFromDate?: Date;

  @Column({ type: 'timestamp', nullable: true }) // Timestamp when the account was disabled
  disabledOnDate?: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relationships
  @OneToOne(() => UserProfile, userProfile => userProfile.userAccount, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'userAccountId' }) // Link by userAccountId in UserProfile
  profile: UserProfile;

  @OneToOne(() => UserPassword, userPassword => userPassword.userAccount, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'userAccountId' }) // Link by userAccountId in UserPassword
  password: UserPassword;

  @OneToMany(() => UserOrganization, userOrganization => userOrganization.userAccount)
  userOrganizations: UserOrganization[];
}