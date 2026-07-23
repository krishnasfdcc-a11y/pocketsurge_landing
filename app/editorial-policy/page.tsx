import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LEGAL_UPDATED_AT, editorialSections } from "@/lib/pages/legal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Editorial Policy",
  description:
    "How the PocketSurge Editorial Team researches, writes, and reviews content.",
});

export default function EditorialPolicyPage() {
  return (
    <LegalPageLayout
      title="Editorial Policy"
      description="Our standards for publishing practical, trustworthy content."
      updatedAt={LEGAL_UPDATED_AT}
      sections={editorialSections}
    />
  );
}
