"use client";

import { useState, type FormEvent } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="relative overflow-hidden border-t border-surface-200 bg-surface-900 py-16 dark:border-surface-800 dark:bg-surface-950 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(ellipse 60% 50% at 20% 50%, rgba(37, 99, 235, 0.35), transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 60%, rgba(14, 165, 233, 0.2), transparent 55%)
          `,
        }}
      />
      <div className="container-page relative">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Stay in the loop
          </h2>
          <p className="mt-3 text-surface-300">
            Newsletter coming soon — leave your email and we&apos;ll let you
            know when the first issue drops.
          </p>

          {submitted ? (
            <p className="mt-8 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80">
              Thanks — newsletter signup isn&apos;t live yet, but we&apos;ve
              noted your interest.
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30"
              />
              <button
                type="submit"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-surface-900 transition hover:-translate-y-0.5 hover:bg-brand-50"
              >
                Notify me
              </button>
            </form>
          )}
          <p className="mt-4 text-xs text-surface-500">
            Placeholder only — no email is stored yet.
          </p>
        </div>
      </div>
    </section>
  );
}
