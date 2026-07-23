import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LEGAL_UPDATED_AT, termsSections } from "@/lib/pages/legal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: "Terms governing your use of the PocketSurge website.",
});

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="The rules for using PocketSurge."
      updatedAt={LEGAL_UPDATED_AT}
      sections={termsSections}
    />
  );
}
