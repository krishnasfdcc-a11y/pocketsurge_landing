import { slugify } from "@/utils/strings";

function injectHeadingIds(html: string): string {
  return html.replace(
    /<h([1-6])(\s[^>]*)?>(.+?)<\/h\1>/gi,
    (_match, level, attrs, text) => {
      if (attrs && /id=/i.test(attrs)) return _match;
      const id = slugify(text);
      const tag = attrs
        ? `<h${level}${attrs} id="${id}">`
        : `<h${level} id="${id}">`;
      return `${tag}${text}</h${level}>`;
    }
  );
}

export function ArticleContent({ content }: { content: string }) {
  const htmlWithIds = injectHeadingIds(content);
  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:text-surface-900 prose-p:leading-relaxed prose-p:text-surface-700 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md prose-code:before:content-none prose-code:after:content-none dark:prose-invert dark:prose-headings:text-surface-100 dark:prose-p:text-surface-300 dark:prose-a:text-brand-400 dark:prose-strong:text-surface-100"
      dangerouslySetInnerHTML={{ __html: htmlWithIds }}
    />
  );
}
