import { SITE } from "@/config/site";

export function JsonLD({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleSchemaLD({
  article,
  url,
}: {
  article: {
    title: string;
    excerpt: string;
    generatedAt: string;
    images: { hero: string | null };
    category: string;
    keywords: string[];
  };
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.generatedAt,
    image: article.images.hero ? `${SITE.url}${article.images.hero}` : undefined,
    author: {
      "@type": "Organization",
      name: SITE.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
    },
    about: article.keywords.join(", "),
    articleSection: article.category,
  };

  return <JsonLD data={schema} />;
}

export function FAQSchemaLD({
  faq,
}: {
  faq: { question: string; answer: string }[];
}) {
  if (!faq.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <JsonLD data={schema} />;
}

export function BreadcrumbSchemaLD({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLD data={schema} />;
}
