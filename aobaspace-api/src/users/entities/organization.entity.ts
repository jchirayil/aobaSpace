import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { UserOrganization } from './user_organization.entity'; // NEW: Import UserOrganization
import { Subscription } from '../../billing/entities/subscription.entity';


@Entity('organizations')
export class Organization {
  @PrimaryColumn({ length: 10 }) // Fixed length for organization ID (e.g., 'xyz789abcd')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  websiteUrl?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ default: true })
  isEnabled: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => UserOrganization, userOrganization => userOrganization.organization)
  userOrganizations: UserOrganization[];

  // An organization can have one subscription
  @OneToOne(() => Subscription, (subscription) => subscription.organization)
  subscription: Subscription;
}