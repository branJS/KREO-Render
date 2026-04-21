/**
 * KREO Analytics — custom event helpers
 *
 * Wraps both Vercel Analytics and Google Analytics 4 so you can fire
 * a single call and both platforms receive the event.
 *
 * Usage:
 *   import { track } from "@/lib/analytics";
 *   track("contact_form_submitted", { section: "contact" });
 *   track("quote_builder_opened");
 *   track("blog_article_read", { slug: post.slug, title: post.title });
 */

import { track as vercelTrack } from "@vercel/analytics";

type EventProperties = Record<string, string | number | boolean>;

/**
 * Fire a named event to Vercel Analytics (and GA4 if configured).
 *
 * @param name   - Event name, e.g. "contact_form_submitted"
 * @param props  - Optional key/value properties
 */
export function track(name: string, props?: EventProperties) {
  // Vercel Analytics
  try {
    vercelTrack(name, props);
  } catch {
    // not in browser yet — no-op
  }

  // Google Analytics 4
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = typeof window !== "undefined" ? (window as any) : null;
  if (w?.gtag) {
    w.gtag("event", name, props ?? {});
  }
}

/**
 * Pre-wired events for KREO — import these instead of writing raw strings
 */
export const KreoEvents = {
  contactFormSubmitted: () => track("contact_form_submitted"),
  contactFormOpened:   () => track("contact_form_opened"),
  quoteBuilderOpened:  () => track("quote_builder_opened"),
  projectViewed:       (slug: string) => track("project_viewed", { slug }),
  blogArticleRead:     (slug: string, title: string) => track("blog_article_read", { slug, title }),
  blogIndexVisited:    () => track("blog_index_visited"),
  shopItemViewed:      (name: string) => track("shop_item_viewed", { name }),
  menuOpened:          () => track("menu_opened"),
  portfolioToJournal:  () => track("navigation_portfolio_to_journal"),
  journalToPortfolio:  () => track("navigation_journal_to_portfolio"),
} as const;
