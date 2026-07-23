import { getArticles, getArticleBySlug } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleMeta } from "@/components/article/ArticleMeta";
import { ArticleContent } from "@/components/article/ArticleContent";
import { ArticleTOC } from "@/components/article/ArticleTOC";
import { ArticleFAQ } from "@/components/article/ArticleFAQ";
import { ArticleImages } from "@/components/article/ArticleImages";
import { ArticleTags } from "@/components/article/ArticleTags";
import { ArticleShare } from "@/components/article/ArticleShare";
import { ArticleBreadcrumb } from "@/components/article/ArticleBreadcrumb";
import { ArticleNav } from "@/components/article/ArticleNav";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";
import { BackToTop } from "@/components/ui/BackToTop";
import {
  ArticleSchemaLD,
  FAQSchemaLD,
  BreadcrumbSchemaLD,
} from "@/components/seo/JsonLD";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const canonicalUrl =
    article.seo.canonicalUrl || `${SITE.url}/article/${slug}`;
  const ogImage = article.images.hero
    ? `${SITE.url}${article.images.hero}`
    : undefined;

  return buildMetadata({
    title: article.seo.seoTitle || article.title,
    description: article.seo.metaDescription || article.excerpt,
    canonicalUrl,
    ogImage,
    type: "article",
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = getArticles();
  const currentIndex = allArticles.findIndex((a) => a.slug === slug);
  const prevArticle =
    currentIndex < allArticles.length - 1
      ? {
          slug: allArticles[currentIndex + 1].slug,
          title: allArticles[currentIndex + 1].title,
        }
      : undefined;
  const nextArticle =
    currentIndex > 0
      ? {
          slug: allArticles[currentIndex - 1].slug,
          title: allArticles[currentIndex - 1].title,
        }
      : undefined;

  return (
    <>
      <ReadingProgressBar />
      <BackToTop />

      <ArticleSchemaLD
        article={{
          title: article.title,
          excerpt: article.excerpt,
          generatedAt: article.generatedAt,
          updatedAt: article.updatedAt,
          images: article.images,
          category: article.category,
          keywords: article.keywords,
        }}
        url={`${SITE.url}/article/${slug}`}
      />
      <FAQSchemaLD faq={article.faq} />
      <BreadcrumbSchemaLD
        items={[
          { name: "Home", url: SITE.url },
          {
            name: article.category,
            url: `${SITE.url}/category/${article.category.toLowerCase()}`,
          },
          { name: article.title, url: `${SITE.url}/article/${slug}` },
        ]}
      />

      <Container size="article-wide" className="py-10">
        <div className="xl:grid xl:grid-cols-[240px_1fr] xl:gap-10">
          <ArticleTOC contentHtml={article.content} sidebar />

          <div className="min-w-0">
            <ArticleBreadcrumb
              category={article.category}
              title={article.title}
            />

            <ArticleHero
              title={article.title}
              category={article.category}
              readingTime={article.readingTime}
              generatedAt={article.generatedAt}
              heroImage={article.images.hero}
            />

            <ArticleMeta
              excerpt={article.excerpt}
              generatedAt={article.generatedAt}
              updatedAt={article.updatedAt}
              readingTime={article.readingTime}
              wordCount={article.wordCount}
            />

            <div className="xl:hidden">
              <ArticleTOC contentHtml={article.content} />
            </div>

            <ArticleContent content={article.content} />

            <ArticleImages images={article.images.gallery} />

            <ArticleTags tags={article.tags} />

            <ArticleFAQ faq={article.faq} />

            <ArticleShare title={article.title} slug={slug} />

            <ArticleNav prev={prevArticle} next={nextArticle} />

            <RelatedArticles article={article} />
          </div>
        </div>
      </Container>
    </>
  );
}
