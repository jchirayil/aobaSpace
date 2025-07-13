import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from './invoice.entity';

export enum InvoiceLineItemType {
  SUBSCRIPTION = 'subscription',
  USAGE = 'usage',
  PRORATION_CREDIT = 'proration_credit',
  PRORATION_DEBIT = 'proration_debit',
}

@Entity('invoice_line_items')
export class InvoiceLineItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  invoiceId: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.lineItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @Column()
  description: string; // e.g., "Pro Plan (July 1 - July 31)"

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: InvoiceLineItemType,
    default: InvoiceLineItemType.SUBSCRIPTION,
  })
  type: InvoiceLineItemType;

  @Column({ type: 'timestamp with time zone' })
  periodStart: Date;

  @Column({ type: 'timestamp with time zone' })
  periodEnd: Date;
}