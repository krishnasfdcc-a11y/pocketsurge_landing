import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LEGAL_UPDATED_AT, aiDisclosureSections } from "@/lib/pages/legal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "AI Content Disclosure",
  description:
    "How PocketSurge uses AI tools in research and editorial production.",
});

export default function AIContentDisclosurePage() {
  return (
    <LegalPageLayout
      title="AI Content Disclosure"
      description="How artificial intelligence may assist our editorial workflow."
      updatedAt={LEGAL_UPDATED_AT}
      sections={aiDisclosureSections}
    />
  );
}
