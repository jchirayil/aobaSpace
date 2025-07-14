import { getMarkdownPageContent } from '@lib/markdown';
import { API_BASE_URL } from "@/config/app.config";
import PricingPageClientContent from "@/components/PricingPageClientContent";
import { Plan } from "@/types/plan";

// Helper function to fetch plans with error handling
async function getPlans(): Promise<Plan[]> {
  console.log("--- [Server] getPlans(): Attempting to fetch plans from API...");
  try {
    // Force dynamic rendering by opting out of the data cache.
    // This ensures the fetch runs on every request, not at build time.
    const res = await fetch(`${API_BASE_URL}/plans`, { cache: 'no-store' });

    console.log(`--- [Server] getPlans(): API response status: ${res.status}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch pricing plans. Status: ${res.status} ${res.statusText}`);
    }

    // IMPORTANT: You can only read the body once.
    // Read it into a variable, log it, then return it.
    const plansData = await res.json();
    console.log("--- [Server] getPlans(): Successfully fetched and parsed plans data:", plansData);

    return plansData;
  } catch (error) {
    console.error("--- [Server] getPlans(): An error occurred:", error);
    return []; // Return an empty array on error so the page can still render
  }
}

export default async function PricingPage() {
  // Fetch data from both sources in parallel for best performance
  const plansData = getPlans();
  const markdownData = getMarkdownPageContent("pricing-plan"); // Assuming you are using pricing-plan.md

  console.log("--- [Server] PricingPage: Kicked off data fetching for plans and markdown.");

  const [plans, { data, sections }] = await Promise.all([
    plansData,
    markdownData,
  ]);

  console.log(`--- [Server] PricingPage: Data fetching complete. Found ${plans.length} plans.`);

  return (
    <PricingPageClientContent
      markdownData={data}
      faqSection={sections.find((s) => s.title === data.faqTitle)}
      plans={plans}
    />
  );
}
