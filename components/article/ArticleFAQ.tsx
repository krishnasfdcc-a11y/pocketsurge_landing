"use client";

import { useState } from "react";
import type { FAQItem } from "@/types/article";

export function ArticleFAQ({ faq }: { faq: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faq.length) return null;

  return (
    <div className="mt-12 border-t border-surface-200 pt-10 dark:border-surface-800">
      <h2 className="mb-6 font-display text-2xl font-bold text-surface-900 dark:text-white">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-surface-200 rounded-xl border border-surface-200 dark:divide-surface-800 dark:border-surface-800">
        {faq.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-surface-50 dark:hover:bg-surface-900"
              >
                <span className="pr-4 font-medium text-surface-900 dark:text-white">
                  {item.question}
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 text-surface-400 transition-transform duration-300 dark:text-surface-500 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 leading-relaxed text-surface-600 dark:text-surface-300">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
