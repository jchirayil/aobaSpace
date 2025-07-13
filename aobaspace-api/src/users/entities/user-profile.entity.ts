import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm"; // Added JoinColumn
import { UserAccount } from "./user-account.entity"; // NEW: Import UserAccount

@Entity("user_profiles")
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number; // Internal primary key

  @Column({ unique: true, length: 10 }) // Foreign key to UserAccount.id
  userAccountId: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  avatarUrl?: string; // URL to the user's avatar image

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  // Relationship - This is where the foreign key is defined
  @OneToOne(() => UserAccount, (userAccount) => userAccount.profile)
  @JoinColumn({ name: "userAccountId", referencedColumnName: "id" }) // userAccountId in UserProfile references id in UserAccount
  userAccount: UserAccount;
}
