import { getMarkdownPageContent } from '@lib/markdown';
import { API_BASE_URL } from "@/config/app.config";
import PricingPageClientContent from "@/components/PricingPageClientContent";
import { Plan } from "@/types/plan";

// Helper function to fetch plans with error handling
async function getPlans(): Promise<Plan[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/plans`, {
      // Revalidate every hour to fetch fresh plan data without a full rebuild
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch pricing plans");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching plans:", error);
    return []; // Return an empty array on error so the page can still render
  }
}

export default async function PricingPage() {
  // Fetch data from both sources in parallel for best performance
  const plansData = getPlans();
  const markdownData = getMarkdownPageContent("pricing");

  const [plans, { data, sections }] = await Promise.all([
    plansData,
    markdownData,
  ]);

  return (
    <PricingPageClientContent
      markdownData={data}
      faqSection={sections.find((s) => s.title === data.faqTitle)}
      plans={plans}
    />
  );
}
