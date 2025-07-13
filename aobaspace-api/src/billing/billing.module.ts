import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Plan } from "./entities/plan.entity";
import { Subscription } from "./entities/subscription.entity";
import { PaymentProfile } from "./entities/payment-profile.entity";
import { Invoice } from "./entities/invoice.entity";
import { InvoiceLineItem } from "./entities/invoice-line-item.entity";
import { PlanSeederService } from "./seeders/plan.seeder";
import { PlansController } from "./plans.controller";
import { PlansService } from "./plans.service";

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
  providers: [PlanSeederService, PlansService],
  controllers: [PlansController],
})
export class BillingModule {}
