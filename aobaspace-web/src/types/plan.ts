export enum BillingInterval {
  MONTH = "month",
  YEAR = "year",
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: BillingInterval;
  description: string;
  isActive: boolean;
  startDate: string; // Dates will be strings over JSON
  endDate: string | null;
}
