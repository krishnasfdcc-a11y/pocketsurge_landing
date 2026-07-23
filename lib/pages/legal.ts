import type { LegalSection } from "@/components/legal/LegalPageLayout";
import { SITE } from "@/config/site";

export const LEGAL_UPDATED_AT = "2026-07-01";

export const privacySections: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      `${SITE.name} ("we", "us", or "our") operates ${SITE.url}. This Privacy Policy explains how we collect, use, and protect information when you visit our website.`,
      `PocketSurge is the publisher and editorial owner of this website. For privacy questions, contact us at ${SITE.email}.`,
    ],
  },
  {
    heading: "Information we collect",
    paragraphs: [
      "We may collect limited technical information automatically, such as browser type, device type, referring pages, and approximate location derived from IP address, through standard web logs or analytics tools.",
      "If you contact us by email, we collect the information you provide in that message, including your email address and any details you choose to share.",
      "We do not require accounts to read articles, and we do not operate a user login system on this site.",
    ],
  },
  {
    heading: "How we use information",
    paragraphs: [
      "We use information to operate and improve the website, understand aggregate readership trends, respond to inquiries, and protect against abuse or technical issues.",
      "We do not sell personal information. We may share data with service providers who help us host, analyze, or secure the site, solely as needed to provide those services.",
    ],
  },
  {
    heading: "Cookies and similar technologies",
    paragraphs: [
      "We may use cookies or similar technologies for essential site functionality (such as remembering your theme preference) and, where enabled, analytics. See our Cookie Policy for more detail.",
    ],
  },
  {
    heading: "Your choices",
    paragraphs: [
      "You can control cookies through your browser settings. You may request access to or deletion of personal information you have provided by contacting us at the email above, subject to applicable law.",
    ],
  },
  {
    heading: "Changes",
    paragraphs: [
      "We may update this Privacy Policy from time to time. The “Last updated” date at the top of this page reflects the latest revision. Continued use of the site after changes constitutes acceptance of the updated policy.",
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    heading: "Agreement to terms",
    paragraphs: [
      `By accessing ${SITE.name} at ${SITE.url}, you agree to these Terms & Conditions. If you do not agree, please do not use the site.`,
      `${SITE.name} is owned and operated by PocketSurge as publisher and editorial owner.`,
    ],
  },
  {
    heading: "Use of content",
    paragraphs: [
      "Articles, images, and other materials on this site are provided for personal, non-commercial informational use unless otherwise stated. You may not republish our content wholesale without prior written permission.",
      "You may link to our articles and quote brief excerpts with attribution and a link back to the original page.",
    ],
  },
  {
    heading: "Acceptable use",
    paragraphs: [
      "You agree not to misuse the site, attempt unauthorized access, scrape content in a way that harms performance, or use the site to distribute malware or illegal material.",
    ],
  },
  {
    heading: "Disclaimer of warranties",
    paragraphs: [
      "Content is provided “as is” without warranties of any kind. We strive for accuracy but do not guarantee completeness or suitability for any particular purpose. See our Disclaimer for additional limitations.",
    ],
  },
  {
    heading: "Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by law, PocketSurge and its contributors are not liable for any indirect, incidental, or consequential damages arising from your use of the site or reliance on its content.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      `Questions about these terms: ${SITE.email}.`,
    ],
  },
];

export const cookiesSections: LegalSection[] = [
  {
    heading: "What are cookies",
    paragraphs: [
      "Cookies are small text files stored on your device. Similar technologies include local storage, which this site may use to remember preferences such as light or dark mode.",
    ],
  },
  {
    heading: "How we use them",
    paragraphs: [
      "Essential: theme preference and similar settings needed for a working interface.",
      "Analytics (if enabled): aggregated traffic insights to improve content and performance. These tools may set their own cookies subject to their policies.",
    ],
  },
  {
    heading: "Managing cookies",
    paragraphs: [
      "Most browsers let you block or delete cookies. Doing so may affect site features such as remembering your display theme. Clearing local storage will reset preferences stored in your browser.",
    ],
  },
  {
    heading: "Updates",
    paragraphs: [
      "We may update this Cookie Policy as our practices change. Review the date at the top of this page for the latest version.",
    ],
  },
];

export const disclaimerSections: LegalSection[] = [
  {
    heading: "General information only",
    paragraphs: [
      `${SITE.name} publishes informational articles for educational and editorial purposes. Content is not professional advice—legal, financial, medical, investment, or otherwise.`,
      "You should consult a qualified professional before making decisions based on information you read here.",
    ],
  },
  {
    heading: "No guarantees",
    paragraphs: [
      "While we aim for accuracy and clarity, we do not warrant that content is error-free, complete, or current. Technologies, products, and markets change quickly; details may become outdated.",
    ],
  },
  {
    heading: "External links",
    paragraphs: [
      "Articles may link to third-party sites. We are not responsible for the content, privacy practices, or availability of external websites.",
    ],
  },
  {
    heading: "Publisher",
    paragraphs: [
      `This disclaimer is issued by PocketSurge, publisher of ${SITE.name}. Contact: ${SITE.email}.`,
    ],
  },
];

export const editorialSections: LegalSection[] = [
  {
    heading: "Our mission",
    paragraphs: [
      `${SITE.name} publishes practical guides, reviews, and deep dives across technology, science, finance, gaming, and culture. We prioritize clarity, usefulness, and respect for readers’ time.`,
    ],
  },
  {
    heading: "Editorial ownership",
    paragraphs: [
      "PocketSurge is the editorial owner and publisher. Day-to-day writing and curation are attributed to the PocketSurge Editorial Team.",
      "We maintain independence in topic selection and recommendations. Commercial relationships, when present, are disclosed (see Affiliate Disclosure).",
    ],
  },
  {
    heading: "Standards",
    paragraphs: [
      "We strive to verify claims, cite sources where appropriate, update material when significant errors are found, and distinguish opinion from reported fact.",
      "Corrections: if you spot an error, email us and we will review and update when warranted.",
    ],
  },
  {
    heading: "AI-assisted production",
    paragraphs: [
      "We may use AI tools in research or drafting. All published work is reviewed under our editorial standards. See AI Content Disclosure for details.",
    ],
  },
];

export const affiliateSections: LegalSection[] = [
  {
    heading: "Transparency",
    paragraphs: [
      `${SITE.name} may earn commissions or referral fees from links to products, services, or platforms mentioned in articles. This does not change the price you pay.`,
    ],
  },
  {
    heading: "Editorial independence",
    paragraphs: [
      "Affiliate relationships do not dictate our conclusions. Recommendations are based on editorial judgment. When a material connection exists, we aim to disclose it clearly in the relevant content.",
    ],
  },
  {
    heading: "Questions",
    paragraphs: [
      `Contact PocketSurge at ${SITE.email} with questions about affiliate relationships on this site.`,
    ],
  },
];

export const aiDisclosureSections: LegalSection[] = [
  {
    heading: "How we use AI",
    paragraphs: [
      `${SITE.name} may use artificial intelligence tools to assist with research, outlining, drafting, summarizing, image generation prompts, or editorial production workflows.`,
      "AI is a tool—not a substitute for editorial responsibility. PocketSurge remains the publisher and accountable party for content on this site.",
    ],
  },
  {
    heading: "Human oversight",
    paragraphs: [
      "Published articles are attributed to the PocketSurge Editorial Team. We review content for accuracy, clarity, and alignment with our Editorial Policy before publication whenever AI assistance is used.",
    ],
  },
  {
    heading: "Limitations",
    paragraphs: [
      "AI systems can produce incorrect or outdated information. Readers should verify critical details independently and not treat any article as professional advice.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      `Questions about our AI practices: ${SITE.email}.`,
    ],
  },
];
