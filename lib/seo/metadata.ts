import { SITE } from "@/config/site";
import type { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  type?: "website" | "article";
}

export function buildMetadata({
  title,
  description,
  canonicalUrl = SITE.url,
  ogImage,
  type = "website",
}: SEOProps): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE.name,
      type,
      locale: "en_US",
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SITE.twitter,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
