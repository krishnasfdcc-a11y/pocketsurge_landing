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
      className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-surface-900 prose-p:leading-relaxed prose-p:text-surface-700 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md"
      dangerouslySetInnerHTML={{ __html: htmlWithIds }}
    />
  );
}
