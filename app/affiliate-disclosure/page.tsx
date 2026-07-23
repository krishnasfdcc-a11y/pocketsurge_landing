import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LEGAL_UPDATED_AT, affiliateSections } from "@/lib/pages/legal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Affiliate Disclosure",
  description:
    "How PocketSurge discloses affiliate and commercial relationships.",
});

export default function AffiliateDisclosurePage() {
  return (
    <LegalPageLayout
      title="Affiliate Disclosure"
      description="Transparency about referral links and commercial relationships."
      updatedAt={LEGAL_UPDATED_AT}
      sections={affiliateSections}
    />
  );
}
