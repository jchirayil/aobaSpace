import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Organization } from "../../organizations/entities/organization.entity";
import { Subscription } from "./subscription.entity";
import { InvoiceLineItem } from "./invoice-line-item.entity";

export enum InvoiceStatus {
  DRAFT = "draft",
  OPEN = "open",
  PAID = "paid",
  UNCOLLECTIBLE = "uncollectible",
  VOID = "void",
}

@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: "organizationId" })
  organization: Organization;

  @Column({ nullable: true })
  subscriptionId: string;

  @ManyToOne(() => Subscription)
  @JoinColumn({ name: "subscriptionId" })
  subscription: Subscription;

  @Column({
    type: "enum",
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amountDue: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  amountPaid: number;

  @Column({ type: "timestamp with time zone" })
  dueDate: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  invoicePdfUrl: string;

  @Column({ nullable: true })
  transactionId: string; // e.g., Stripe charge ID

  @OneToMany(() => InvoiceLineItem, (lineItem) => lineItem.invoice, {
    cascade: true,
    eager: true,
  })
  lineItems: InvoiceLineItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
