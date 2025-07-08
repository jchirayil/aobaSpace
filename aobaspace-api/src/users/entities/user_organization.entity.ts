import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserAccount } from './user_account.entity'; // NEW: Import UserAccount
import { Organization } from './organization.entity'; // NEW: Import Organization

@Entity('user_organizations')
export class UserOrganization {
  @PrimaryColumn({ length: 10 }) // Composite primary key part
  userAccountId: string;

  @PrimaryColumn({ length: 10 }) // Composite primary key part
  organizationId: string;

  @Column()
  role: string; // e.g., 'admin', 'member', 'billing_admin', 'support_admin'

  @Column({ default: true })
  isActive: boolean; // Indicates if the user's membership in this org is active

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => UserAccount, userAccount => userAccount.userOrganizations)
  @JoinColumn({ name: 'userAccountId' })
  userAccount: UserAccount;

  @ManyToOne(() => Organization, organization => organization.userOrganizations)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}