import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // Table name in database
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string; // Can be email or a unique ID

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password?: string; // Store hashed password, not plain text!

  @Column({ nullable: true })
  ssoProvider?: string; // e.g., 'google', 'microsoft'

  @Column({ nullable: true })
  ssoId?: string; // ID from the SSO provider

  @Column({ default: 'user' }) // Default role
  role: string; // e.g., 'admin', 'billing_admin', 'support_admin', 'user'

  @Column({ type: 'jsonb', nullable: true })
  permissions?: any; // Store granular permissions as JSONB

  @Column({ nullable: true })
  instanceId?: string; // ID of the AobaForms instance this user belongs to

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}