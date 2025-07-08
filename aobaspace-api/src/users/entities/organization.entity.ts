import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserOrganization } from './user_organization.entity'; // NEW: Import UserOrganization

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
}