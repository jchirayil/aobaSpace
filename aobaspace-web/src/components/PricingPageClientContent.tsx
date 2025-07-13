"use client";

import React from "react";
import Link from "next/link";
import { Plan } from "@/types/plan";

interface PricingPageClientContentProps {
  markdownData: any;
  faqSection: { title: string; contentHtml: string } | undefined;
  plans: Plan[];
}

const PricingPageClientContent: React.FC<PricingPageClientContentProps> = ({
  markdownData,
  faqSection,
  plans,
}) => {
  return (
    <main className="bg-gray-50">
      {/* Hero Section from Markdown */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            {markdownData.heroTitle || "Pricing"}
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            {markdownData.heroSubtitle || "Choose the best plan for your team."}
          </p>
        </div>
      </section>

      {/* Pricing Plans Section from Database */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-lg shadow-lg p-8 flex flex-col text-center border-t-4 border-blue-500"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-5xl font-extrabold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-lg text-gray-500">
                      /{plan.interval}
                    </span>
                  </div>
                  <ul className="text-left space-y-2 mb-8 text-gray-600">
                    {/* You can enhance this by adding a features list to the Plan entity */}
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✔</span> Unlimited
                      Forms
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✔</span> Voice &
                      Image Input
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✔</span> Data
                      Analytics
                    </li>
                  </ul>
                  <Link
                    href="/register"
                    className="mt-auto bg-blue-600 text-white hover:bg-blue-700 font-bold py-3 px-8 rounded-full text-lg shadow-md transition duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-600">
                Pricing plans are currently unavailable. Please check back
                later.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section from Markdown */}
      {faqSection && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              {faqSection.title}
            </h2>
            <div
              className="prose lg:prose-xl max-w-full"
              dangerouslySetInnerHTML={{ __html: faqSection.contentHtml }}
            />
          </div>
        </section>
      )}
    </main>
  );
};

export default PricingPageClientContent;
