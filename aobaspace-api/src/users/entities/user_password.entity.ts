import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm'; // Added JoinColumn
import { UserAccount } from './user_account.entity'; // NEW: Import UserAccount

@Entity('user_passwords')
export class UserPassword {
  @PrimaryGeneratedColumn()
  id: number; // Internal primary key for this table

  @Column({ unique: true, length: 10 }) // Foreign key to UserAccount.id
  userAccountId: string;

  @Column()
  hashedPassword: string; // Stores the hashed password

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enabledFromDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  disabledOnDate?: Date;

  @Column({ default: true })
  isActive: boolean; // Derived from dates, but can be explicitly set for quick disable

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relationship - This is where the foreign key is defined
  @OneToOne(() => UserAccount, userAccount => userAccount.password)
  @JoinColumn({ name: 'userAccountId', referencedColumnName: 'id' }) // userAccountId in UserPassword references id in UserAccount
  userAccount: UserAccount;
}