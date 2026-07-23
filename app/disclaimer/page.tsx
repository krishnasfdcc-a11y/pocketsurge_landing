import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LEGAL_UPDATED_AT, disclaimerSections } from "@/lib/pages/legal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  description:
    "Important limitations on PocketSurge content — informational only, not professional advice.",
});

export default function DisclaimerPage() {
  return (
    <LegalPageLayout
      title="Disclaimer"
      description="Important limitations on how our content should be used."
      updatedAt={LEGAL_UPDATED_AT}
      sections={disclaimerSections}
    />
  );
}
