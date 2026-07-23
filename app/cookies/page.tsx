import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LEGAL_UPDATED_AT, cookiesSections } from "@/lib/pages/legal";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: "How PocketSurge uses cookies and similar technologies.",
});

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="Cookies and local storage on PocketSurge."
      updatedAt={LEGAL_UPDATED_AT}
      sections={cookiesSections}
    />
  );
}
