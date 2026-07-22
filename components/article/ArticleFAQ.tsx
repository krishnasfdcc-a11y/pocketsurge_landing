"use client";

import { useState } from "react";
import type { FAQItem } from "@/types/article";

export function ArticleFAQ({ faq }: { faq: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faq.length) return null;

  return (
    <div className="mt-12 border-t border-surface-200 pt-10">
      <h2 className="mb-6 text-2xl font-bold text-surface-900">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-surface-200 rounded-xl border border-surface-200">
        {faq.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-surface-50"
            >
              <span className="pr-4 font-medium text-surface-900">
                {item.question}
              </span>
              <svg
                className={`h-5 w-5 shrink-0 text-surface-400 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
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
            {openIndex === index && (
              <div className="px-5 pb-4">
                <p className="leading-relaxed text-surface-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
