import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Plan } from "./entities/plan.entity";
import { Subscription } from "./entities/subscription.entity";
import { PaymentProfile } from "./entities/payment_profile.entity";
import { Invoice } from "./entities/invoice.entity";
import { InvoiceLineItem } from "./entities/invoice_line_item.entity";
import { PlanSeederService } from "./seeders/plan.seeder";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Plan,
      Subscription,
      PaymentProfile,
      Invoice,
      InvoiceLineItem,
    ]),
  ],
  providers: [PlanSeederService],
  // controllers: [], // Controllers for billing endpoints will be added here later
})
export class BillingModule {}
