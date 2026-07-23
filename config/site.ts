export const SITE = {
  name: "PocketSurge",
  url: "https://pocketsurge.com",
  description:
    "Your daily dose of insights, guides, and reviews across technology, science, finance, gaming, and more.",
  twitter: "@pocketsurge",
  language: "en",
  email: "hello@pocketsurge.com",
  author: {
    name: "PocketSurge Editorial Team",
    slug: "author",
    role: "Editorial Team",
    bio: "The PocketSurge Editorial Team researches and writes practical guides, deep dives, and reviews across technology, science, finance, gaming, and culture. We focus on clear takeaways, honest trade-offs, and content worth finishing.",
    email: "editorial@pocketsurge.com",
  },
} as const;

export const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
  { href: "/ai-content-disclosure", label: "AI Content Disclosure" },
] as const;

export const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/author", label: "Editorial Team" },
] as const;

export const EXPLORE_LINKS = [
  { href: "/articles", label: "All Articles" },
  { href: "/categories", label: "Categories" },
  { href: "/tags", label: "Tags" },
  { href: "/latest", label: "Latest" },
  { href: "/trending", label: "Trending" },
  { href: "/search", label: "Search" },
] as const;

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "ai-ml": "Artificial intelligence, machine learning, and the tools reshaping how we build and work.",
  cybersecurity: "Threats, defenses, and practical security guidance for builders and teams.",
  science: "Discoveries, research, and ideas that expand how we understand the world.",
  technology: "Hardware, software, and the platforms powering modern life.",
  "web-development": "Frontend, backend, and full-stack practices for the modern web.",
  finance: "Markets, money, and practical insights for smarter financial decisions.",
  "mobile-development": "iOS, Android, and cross-platform mobile engineering.",
  "data-science": "Data analysis, pipelines, and decision-making with numbers.",
  devops: "Infrastructure, CI/CD, cloud, and reliable delivery practices.",
  gaming: "Games, platforms, and the culture around interactive entertainment.",
  entertainment: "Film, TV, streaming, and the stories shaping popular culture.",
};
