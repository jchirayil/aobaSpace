import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Plan, BillingInterval } from "../entities/plan.entity";

@Injectable()
export class PlanSeederService implements OnModuleInit {
  private readonly logger = new Logger(PlanSeederService.name);

  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const count = await this.planRepository.count();
    if (count > 0) {
      this.logger.log("Plans table already has data. Skipping seed.");
      return;
    }

    this.logger.log("Seeding initial plans...");

    const plansToSeed: Partial<Plan>[] = [
      {
        name: "Free Plan",
        price: 0.0,
        description: "Basic features for individual use. Get started for free.",
        isActive: true,
        startDate: new Date(),
      },
      {
        name: "Pro Plan",
        price: 49.99,
        interval: BillingInterval.MONTH,
        description: "Advanced features for professionals and small teams.",
        isActive: true,
        startDate: new Date(),
      },
      {
        name: "Enterprise Plan",
        price: 299.99,
        interval: BillingInterval.MONTH,
        description:
          "Comprehensive solutions for large organizations. Contact us for yearly pricing.",
        isActive: true,
        startDate: new Date(),
      },
    ];

    await this.planRepository.save(plansToSeed);
    this.logger.log("Successfully seeded plans.");
  }
}
