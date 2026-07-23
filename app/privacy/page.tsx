import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LEGAL_UPDATED_AT, privacySections } from "@/lib/pages/legal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How PocketSurge collects, uses, and protects information when you visit our website.",
});

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="How we handle information on PocketSurge."
      updatedAt={LEGAL_UPDATED_AT}
      sections={privacySections}
    />
  );
}
