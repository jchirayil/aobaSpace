import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Plan } from "./entities/plan.entity";

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>
  ) {}

  /**
   * Finds all active plans available for subscription, ordered by price.
   */
  findAllActive(): Promise<Plan[]> {
    return this.planRepository.find({
      where: { isActive: true },
      order: { price: "ASC" },
    });
  }
}
