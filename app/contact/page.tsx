import { SITE } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `Contact ${SITE.name} for editorial questions, corrections, or partnerships.`,
});

export default function ContactPage() {
  return (
    <Container size="article" className="py-12 sm:py-16">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Contact
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
          Get in touch
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-surface-500 dark:text-surface-400">
          We read every message. For the fastest response, email us directly.
        </p>
      </Reveal>

      <Reveal delay={80} className="mt-10">
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6 sm:p-8 dark:border-surface-800 dark:bg-surface-900">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
            Email
          </p>
          <a
            href={`mailto:${SITE.email}?subject=PocketSurge%20inquiry`}
            className="mt-1 block font-display text-xl font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            {SITE.email}
          </a>
          <p className="mt-4 text-sm text-surface-500 dark:text-surface-400">
            Editorial:{" "}
            <a
              href={`mailto:${SITE.author.email}`}
              className="font-medium text-surface-800 hover:text-brand-600 dark:text-surface-200"
            >
              {SITE.author.email}
            </a>
          </p>
        </div>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        <form
          className="space-y-5"
          action={`mailto:${SITE.email}`}
          method="get"
          encType="text/plain"
        >
          <input type="hidden" name="subject" value="PocketSurge contact" />
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-surface-700 dark:text-surface-300"
            >
              Name
            </label>
            <input
              id="name"
              name="body"
              type="text"
              placeholder="Your name"
              className="mt-1.5 w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-surface-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-950 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-surface-700 dark:text-surface-300"
            >
              Message
            </label>
            <textarea
              id="message"
              name="body"
              rows={5}
              placeholder="How can we help?"
              className="mt-1.5 w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-surface-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-950 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-700"
          >
            Open email draft
          </button>
          <p className="text-xs text-surface-400">
            This form opens your email client — no data is stored on our
            servers.
          </p>
        </form>
      </Reveal>
    </Container>
  );
}
