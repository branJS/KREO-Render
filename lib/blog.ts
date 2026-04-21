import { client } from './sanity';
import imageUrlBuilder from '@sanity/image-url';

/* ══════════════════════════════════════════════════════════════════════════
   KREO JOURNAL — Blog data layer
   ─────────────────────────────────────────────────────────────────────────
   • BlogPost interface matches both hardcoded posts AND Sanity documents
   • getAllPosts() / getPost() — synchronous, read from hardcoded POSTS array
     (safe to call from Client Components like BlogSection on the home page)
   • fetchAllPosts() / fetchPost() — async, fetch from Sanity with fallback
     to the hardcoded array (used by server-rendered blog pages)
══════════════════════════════════════════════════════════════════════════ */

export type PostTheme = 'default' | 'dark' | 'minimal' | 'editorial';

export interface BlogPost {
  slug:         string;
  title:        string;
  description:  string;
  date:         string;
  readTime:     string;
  tags:         string[];
  content:      string;           // rendered HTML string
  accentColor?: string;
  /** Optional thumbnail image URL */
  thumbnail?:   string;
  /** Visual mode for the article page */
  theme?:       PostTheme;
}

/* ════════════════════════════════════════════════════════════════════════
   HARDCODED POSTS (fallback / seed data)
   Used when Sanity has no documents yet, or when called from client components
════════════════════════════════════════════════════════════════════════ */

export const POSTS: BlogPost[] = [
  {
    slug: "negative-space-logo-design",
    title: "The Art of Negative Space: When What You Remove Matters More",
    description:
      "There's an arrow in the FedEx logo. Most people have never noticed it. Once you do, you can't unsee it — and the brand becomes more interesting, more clever, more memorable.",
    date: "2025-06-10",
    readTime: "6 min read",
    tags: ["Logo Design", "Design Theory", "Branding"],
    accentColor: "#1E6FE0",
    content: `
<p>There's an arrow in the FedEx logo. Most people have never noticed it. Once you do, you cannot unsee it — and the brand becomes more interesting, more clever, more memorable.</p>
<p>It was there all along. In the space between the E and the X.</p>
<p>This is what negative space does in logo design: it rewards attention. It creates depth and meaning without adding a single element. It transforms a mark from something you look at into something you <em>experience</em>.</p>
<h2>What Negative Space Actually Is</h2>
<p>In design, negative space refers to the area around and between the subjects of an image. In logo design specifically, it refers to the deliberate shaping of the empty areas within or around a mark to create secondary meaning.</p>
<p>It's not accidental. The best examples of negative space in logo design are the result of methodical, disciplined thinking — using what's <em>not</em> there as actively as what is.</p>
<blockquote>A mark that works on two levels is worth twice as much as one that works on one. Negative space is how you build the second level.</blockquote>
<h2>Five Logos That Mastered the Invisible</h2>
<h3>FedEx (Lindon Leader, 1994)</h3>
<p>The most famous negative space logo ever created. The gap between the E and X forms a perfect forward-pointing arrow — representing speed, precision, and direction. It won over 40 design awards and has never been redesigned in 30 years.</p>
<h3>Amazon (Turner Duckworth)</h3>
<p>The smile arrow beneath "amazon" does triple duty: it's a smile (friendliness and satisfaction), an arrow pointing from a to z (we sell everything), and a face expressing delight. Three meanings from one curved line.</p>
<h3>NBC Peacock</h3>
<p>The space between the feathers forms a bird in flight only when the whole mark is read together. Each feather simultaneously represents a different division of the network.</p>
<h3>Guild of Food Writers</h3>
<p>A pen nib that, when inverted, reads as a spoon. Writing and food sharing exactly the same form — the mark is the idea.</p>
<h3>Yoga Australia</h3>
<p>A woman in a yoga pose whose stretched arm and leg create the recognisable outline of the Australian continent. Geography, identity, and practice collapsed into a single silhouette.</p>
<h2>Why Negative Space Makes Logos Memorable</h2>
<p>The psychology here is well-documented. When the brain identifies a hidden element in an image, it releases a small amount of dopamine — the same mechanism at work in puzzles and "aha" moments.</p>
<h2>How to Brief a Designer for Negative Space</h2>
<ul>
  <li><strong>Give space for conceptual thinking</strong>, not just execution</li>
  <li><strong>Brief around meaning</strong>, not just aesthetics</li>
  <li><strong>Ask to see sketch stages</strong> and concept rationale</li>
  <li><strong>Be open to surprising solutions</strong></li>
</ul>
<h2>KREO's Approach to Mark-Making</h2>
<p>At KREO Studio, every logo project begins with conceptual exploration. Negative space, letterform reduction, geometric interplay — these are the tools of considered logo design, and they're the difference between a mark that's recognised and one that's <em>remembered</em>.</p>
<p>If you're in Plymouth or the wider UK and you want a logo that does more than look nice, <a href="/#contact">let's talk</a>.</p>
    `.trim(),
  },
  {
    slug: "colour-psychology-branding",
    title: "Colour Psychology: The Invisible Force Behind Every Great Brand",
    description:
      "Before a word is read, before a price is seen — colour has already done its work. In 90 milliseconds, up to 90% of a first impression is driven by colour alone.",
    date: "2025-05-18",
    readTime: "7 min read",
    tags: ["Branding", "Design Theory", "Strategy"],
    accentColor: "#E24C3A",
    content: `
<p>Before a single word is read, before a product is held, before a price is seen — colour has already done its work. In the 90 milliseconds it takes a customer to form a first impression of your brand, up to <strong>90% of that decision is influenced by colour alone</strong>.</p>
<p>This isn't aesthetics. It's neuroscience. And it's one of the most underused strategic tools in branding.</p>
<h2>Why Colour Works the Way It Does</h2>
<p>Colour triggers the limbic system — the part of the brain responsible for emotion, memory, and behaviour. It does this before the rational mind engages.</p>
<blockquote>The brands you trust most have spent enormous resources ensuring their colour triggers exactly the feeling they want before you consciously register anything.</blockquote>
<h2>The Colour Profiles That Define Modern Branding</h2>
<h3>Red — Urgency, Passion, Power</h3>
<p>Red accelerates the heart rate. It creates a measurable physiological response. This is why it's the weapon of choice for fast food brands, clearance sale banners, and subscription services that need you to act now.</p>
<h3>Blue — Trust, Calm, Authority</h3>
<p>Blue is the most globally trusted colour in branding. PayPal, Barclays, LinkedIn, Samsung — institutions where trust is the primary product default to blue.</p>
<h3>Yellow — Optimism, Attention, Intelligence</h3>
<p>Yellow is the colour the human eye processes first. At KREO, yellow is our primary brand colour — chosen deliberately. It communicates that our work is visible, confident, and forward-moving.</p>
<h3>Black — Luxury, Sophistication, Precision</h3>
<p>Black is the absence of colour, and in branding that creates space for projection. Chanel, Apple, Rolex — brands that want customers to project their own aspirations onto them lean on black heavily.</p>
<h2>The 60-30-10 Rule</h2>
<p>Professional brand colour systems almost always follow a ratio: <strong>60% dominant colour, 30% secondary, 10% accent</strong>. The dominant colour sets the overall feel. The secondary provides contrast. The accent creates moments of emphasis.</p>
<h2>Practical Questions Before Choosing Brand Colours</h2>
<ul>
  <li><strong>What emotion do I want customers to feel first?</strong></li>
  <li><strong>What do my competitors use?</strong></li>
  <li><strong>Where will this colour live?</strong></li>
  <li><strong>Will this colour age well in 10 years?</strong></li>
</ul>
<p>KREO Studio approaches every brand identity project with colour psychology at the foundation. <a href="/#contact">Let's start that conversation.</a></p>
    `.trim(),
  },
  {
    slug: "motion-design-brands-2025",
    title: "Motion Design in 2025: Why Static Brands Are Being Left Behind",
    description:
      "Your logo sits still on a business card. But it also lives in a world that scrolls, moves, and breathes. In every context except the first — stillness is a failure mode.",
    date: "2025-04-22",
    readTime: "6 min read",
    tags: ["Motion", "Animation", "Digital", "Branding"],
    accentColor: "#00B6A3",
    content: `
<p>Your logo sits still on a business card. It also sits still on a website that scrolls, on a social feed that moves, in a video that breathes. In every one of those contexts except the first — stillness is a failure mode.</p>
<p>Motion design isn't decoration. It's communication. And in 2025, it's no longer optional.</p>
<h2>What Motion Actually Does</h2>
<p>When something moves on screen, the human visual system cannot ignore it. Motion design hijacks this instinct in service of your brand.</p>
<ul>
  <li><strong>Directs attention</strong> — A subtle animation tells the eye where to look next</li>
  <li><strong>Communicates personality</strong> — How something moves says as much as what it is</li>
  <li><strong>Builds memory</strong> — Moving assets are recalled at significantly higher rates</li>
  <li><strong>Signals modernity</strong> — Brands that move feel alive; brands that don't feel dated</li>
</ul>
<blockquote>The difference between a brand that feels alive and one that feels static isn't the logo — it's what the logo does when it loads.</blockquote>
<h2>Types of Motion Design</h2>
<h3>Logo Animation</h3>
<p>The first and most impactful motion investment for most brands. An animated logo doesn't need to be complex — some of the most effective are simply the letterforms drawing themselves.</p>
<h3>UI Micro-animations</h3>
<p>The small interactions that make a website feel considered. Buttons that respond to hover. Page transitions that feel like turning a page rather than teleportation.</p>
<h3>Social Media Motion</h3>
<p>Instagram Reels, TikTok, and YouTube Shorts have fundamentally changed the social landscape. Animated graphics consistently outperform static equivalents for engagement, reach, and recall.</p>
<h2>Animation Principles That Separate Pro from Amateur</h2>
<ul>
  <li><strong>Anticipation</strong> — A slight pause before action makes movement feel intentional</li>
  <li><strong>Follow-through</strong> — Elements that slightly overshoot and settle back feel organic</li>
  <li><strong>Ease in / ease out</strong> — Nothing in the natural world starts or stops instantaneously</li>
  <li><strong>Secondary action</strong> — Supporting movements add depth</li>
</ul>
<p>KREO Studio creates motion graphics for brands across Plymouth, Devon, and the UK. Motion design starts from <strong>£450</strong>. <a href="/#contact">Get in touch</a> to discuss your project.</p>
    `.trim(),
  },
  {
    slug: "logo-design-cost-plymouth",
    title: "How Much Does Logo Design Cost in Plymouth? [2025 Pricing Guide]",
    description:
      "Wondering what logo design costs in Plymouth, Devon? We break down real pricing — from budget freelancers to studio rates — so you know exactly what to expect.",
    date: "2025-01-15",
    readTime: "5 min read",
    tags: ["Logo Design", "Plymouth", "Pricing", "Branding"],
    accentColor: "#F5C100",
    content: `
<p>One of the first questions Plymouth businesses ask when they're ready to level up their brand is: <strong>how much does a logo actually cost?</strong></p>
<h2>Logo Design Pricing in Plymouth: A Real Breakdown</h2>
<h3>Freelance Platforms (£50–£150)</h3>
<p>Services like Fiverr and 99designs offer cheap logo creation, but you typically get what you pay for — a pre-made template with your name dropped in, no real strategic thinking, and zero local market knowledge.</p>
<h3>Local Plymouth Freelancer (£150–£500)</h3>
<p>A quality local designer will typically charge between £150 and £500 for a professional logo. At <strong>KREO Studio</strong>, logo design starts from <strong>£250</strong>, which includes your primary mark, variations, and full delivery in print-ready and digital formats.</p>
<h3>Full Brand Identity (£700–£2,000+)</h3>
<p>If you need more than a logo — colour palettes, typography guidelines, brand voice, asset packs — a full brand identity project is what you're looking for. KREO's brand identity packages start at <strong>£700</strong>.</p>
<h2>What Affects the Price?</h2>
<ul>
  <li><strong>Number of concepts</strong> — More initial directions = more cost</li>
  <li><strong>Revision rounds</strong> — Most studio packages include 2–3 rounds</li>
  <li><strong>File formats needed</strong> — Print-ready vector files take more prep</li>
  <li><strong>Turnaround time</strong> — Rush jobs typically carry a premium</li>
  <li><strong>Complexity</strong> — A detailed illustrated mark takes longer than a wordmark</li>
</ul>
<h2>Is Cheap Logo Design Worth It?</h2>
<p>In short: rarely. Your logo is the face of your business. A weak logo actively costs you credibility. Plymouth is a competitive market — getting it right the first time is almost always cheaper than rebranding 12 months later.</p>
<p>KREO Studio is based in Plymouth. <a href="/#contact">Get in touch</a> for a no-obligation quote.</p>
    `.trim(),
  },
  {
    slug: "graphic-design-plymouth-guide",
    title: "Graphic Design Plymouth: 5 Things to Look for in a Creative Studio",
    description:
      "Not all graphic designers in Plymouth are equal. Here's how to find the right one for your business — without wasting time or money.",
    date: "2025-02-03",
    readTime: "6 min read",
    tags: ["Graphic Design", "Plymouth", "Business", "Studio"],
    accentColor: "#2DBA72",
    content: `
<p>Plymouth has no shortage of people calling themselves graphic designers. Here are five things that separate a genuinely capable studio from one that will waste your time and budget.</p>
<h2>1. Their Portfolio Actually Matches Your Industry</h2>
<p>Look for a studio whose previous work demonstrates range <em>and</em> depth — ideally across both print and digital outputs. Ask to see: logo design, brand identity systems, print work, and digital/web design.</p>
<h2>2. They Ask Questions Before Quoting</h2>
<p>A good graphic designer doesn't just dive straight into Illustrator. They'll want to understand your business goals, your target audience, and what success looks like for this project.</p>
<h2>3. They Can Handle Both Print and Digital</h2>
<p>In 2025, your brand needs to look great on a business card and on a mobile screen. The technical requirements are completely different. At <strong>KREO Studio</strong>, every project is delivered in all the formats you need.</p>
<h2>4. They're Transparent About Revisions and Pricing</h2>
<p>Before signing anything, make sure you understand how many revision rounds are included, what counts as a "revision" versus a new direction, and what happens outside the original scope.</p>
<h2>5. They Have Local Knowledge</h2>
<p>There's a real advantage to working with a graphic designer based in Plymouth or Devon. They understand the local market and what kind of visual language resonates with your audience.</p>
<p><a href="/#pricing">See our pricing</a> or <a href="/#contact">get in touch</a> to discuss your project.</p>
    `.trim(),
  },
  {
    slug: "web-design-plymouth-local",
    title: "Website Design Plymouth: Why Choosing a Local Designer Matters",
    description:
      "Thinking about website design in Plymouth? Here's why working with a local designer beats an overseas agency or national template service every time.",
    date: "2025-03-10",
    readTime: "5 min read",
    tags: ["Website Design", "Plymouth", "Local Business", "Digital"],
    accentColor: "#E56BE3",
    content: `
<p>When Plymouth businesses start thinking about a new website, the temptation is to use a cheap national template service. Here's why choosing a local website designer gives your business a genuine edge.</p>
<h2>They Know Your Market</h2>
<p>A web designer based in Plymouth understands the South West business landscape in a way that a team in Mumbai or Manchester simply doesn't. This local market knowledge feeds directly into copy, imagery choices, and user experience decisions.</p>
<h2>Better Communication = Better Results</h2>
<p>Working with someone in the same time zone — ideally the same city — means you can have a real conversation when something needs adjusting. When you work with <strong>KREO Studio</strong>, you're working directly with the person doing the work.</p>
<h2>Local SEO Built In</h2>
<p>A Plymouth-based web designer will naturally incorporate local SEO signals from the start — your location, service area, local keywords, and Google Business Profile integration.</p>
<h2>What a KREO Website Includes</h2>
<p>Website design at KREO starts at <strong>£900</strong> and includes custom layouts, mobile-first responsive design, performance optimisation, and SEO foundations.</p>
<ul>
  <li>Custom design — no templates</li>
  <li>Mobile-first build</li>
  <li>Local SEO foundations</li>
  <li>Contact form integration</li>
  <li>Google Analytics setup</li>
  <li>30-day post-launch support</li>
</ul>
<p><a href="/#contact">Get in touch</a> for a free consultation and quote.</p>
    `.trim(),
  },
  {
    slug: "brand-identity-plymouth-business",
    title: "Brand Identity for Plymouth Businesses: Where to Start",
    description:
      "Your brand is more than a logo. Here's how Plymouth businesses should think about brand identity — and how to build one that lasts.",
    date: "2025-04-01",
    readTime: "7 min read",
    tags: ["Branding", "Plymouth", "Identity", "Strategy"],
    accentColor: "#1E6FE0",
    content: `
<p>Most Plymouth businesses underestimate the value of a coherent brand identity. A logo is just the beginning — your brand is the full system of visual and verbal signals that tell your customers who you are.</p>
<h2>What Is a Brand Identity System?</h2>
<ul>
  <li><strong>Logo suite</strong> — Primary, secondary, and icon variations</li>
  <li><strong>Colour palette</strong> — Primary and secondary brand colours</li>
  <li><strong>Typography</strong> — Headline and body typefaces, hierarchy rules</li>
  <li><strong>Photography/imagery style</strong> — Guidelines for the kind of images that fit your brand</li>
  <li><strong>Brand voice</strong> — How you write and speak</li>
</ul>
<h2>Why Plymouth Businesses Often Get This Wrong</h2>
<p>The most common mistake is building a brand in pieces. A logo from Fiverr, a website from a template, business cards designed by the printer. The result is a business that looks inconsistent and unpolished.</p>
<h2>When Should You Invest in Brand Identity?</h2>
<ul>
  <li>You're launching a new business in Plymouth or Devon</li>
  <li>Your existing brand feels outdated or misaligned</li>
  <li>You're entering a new market or targeting a new customer segment</li>
  <li>You're about to invest in advertising and need a brand that converts</li>
</ul>
<h2>KREO Brand Identity — Plymouth &amp; Beyond</h2>
<p>KREO Studio builds brand identity systems for businesses in Plymouth, Devon, Cornwall, and across the UK. Our brand identity packages start at <strong>£700</strong>.</p>
<p><a href="/#contact">Start a project</a> or <a href="/#pricing">view our pricing</a>.</p>
    `.trim(),
  },
];

/* ════════════════════════════════════════════════════════════════════════
   SYNC HELPERS — used by client components (BlogSection on home page)
════════════════════════════════════════════════════════════════════════ */

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PORTABLE TEXT → HTML SERIALIZER
   Converts Sanity rich-text blocks to the HTML string format BlogPost.content expects
════════════════════════════════════════════════════════════════════════ */

type PTMark = { _key: string; _type: string; href?: string; blank?: boolean };
type PTSpan = { _type: string; text: string; marks?: string[] };
type PTBlock = {
  _type: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: PTSpan[];
  markDefs?: PTMark[];
  asset?: { url: string };
  alt?: string;
  caption?: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function serializeSpans(spans: PTSpan[], markDefs: PTMark[] = []): string {
  return (spans ?? [])
    .map((span) => {
      if (span._type === 'hardBreak') return '<br />';
      let text = escapeHtml(span.text ?? '');
      const marks = span.marks ?? [];
      // Apply annotations first (outermost)
      for (const mark of marks) {
        const def = markDefs.find((d) => d._key === mark);
        if (def?._type === 'link') {
          const target = def.blank ? ' target="_blank" rel="noopener noreferrer"' : '';
          text = `<a href="${escapeHtml(def.href ?? '')}"${target}>${text}</a>`;
        }
      }
      // Apply decorators
      if (marks.includes('strong')) text = `<strong>${text}</strong>`;
      if (marks.includes('em'))     text = `<em>${text}</em>`;
      return text;
    })
    .join('');
}

export function portableTextToHtml(blocks: PTBlock[]): string {
  if (!blocks?.length) return '';

  let html = '';
  let listType: 'ul' | 'ol' | null = null;

  for (const block of blocks) {
    // Inline images
    if (block._type === 'image') {
      if (listType) { html += `</${listType}>`; listType = null; }
      const url = block.asset?.url ?? '';
      const alt = escapeHtml(block.alt ?? '');
      const caption = block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : '';
      html += `<figure><img src="${url}" alt="${alt}" style="width:100%;height:auto;display:block;" />${caption}</figure>`;
      continue;
    }

    if (block._type !== 'block') continue;

    const content = serializeSpans(block.children ?? [], block.markDefs ?? []);

    // List items
    if (block.listItem) {
      const tag: 'ul' | 'ol' = block.listItem === 'number' ? 'ol' : 'ul';
      if (listType !== tag) {
        if (listType) html += `</${listType}>`;
        html += `<${tag}>`;
        listType = tag;
      }
      html += `<li>${content}</li>`;
      continue;
    }

    // Close any open list
    if (listType) { html += `</${listType}>`; listType = null; }

    switch (block.style) {
      case 'h2':         html += `<h2>${content}</h2>`; break;
      case 'h3':         html += `<h3>${content}</h3>`; break;
      case 'blockquote': html += `<blockquote><p>${content}</p></blockquote>`; break;
      default:
        if (content) html += `<p>${content}</p>`;
    }
  }

  if (listType) html += `</${listType}>`;
  return html;
}

/* ════════════════════════════════════════════════════════════════════════
   SANITY → BlogPost CONVERTER
════════════════════════════════════════════════════════════════════════ */

const builder = imageUrlBuilder(client);

function sanityImageUrl(source: unknown): string | undefined {
  if (!source) return undefined;
  try {
    return builder.image(source as Parameters<typeof builder.image>[0]).width(1200).url();
  } catch {
    return undefined;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanityDocToPost(doc: any): BlogPost {
  return {
    slug:        doc.slug?.current ?? doc._id,
    title:       doc.title        ?? 'Untitled',
    description: doc.description  ?? '',
    date:        doc.publishedAt  ?? doc._createdAt ?? new Date().toISOString(),
    readTime:    doc.readTime     ?? '5 min read',
    tags:        doc.tags         ?? [],
    accentColor: doc.accentColor  ?? undefined,
    thumbnail:   sanityImageUrl(doc.thumbnail),
    theme:       (doc.theme as PostTheme) ?? 'default',
    // rawHtml overrides body if present
    content: doc.rawHtml?.trim()
      ? doc.rawHtml.trim()
      : portableTextToHtml(doc.body ?? []),
  };
}

/* ════════════════════════════════════════════════════════════════════════
   ASYNC SANITY FETCH FUNCTIONS
   Used by server components (app/blog/page.tsx, app/blog/[slug]/page.tsx)
   Falls back to hardcoded POSTS if Sanity returns nothing
════════════════════════════════════════════════════════════════════════ */

const BLOG_FIELDS = `
  _id, _createdAt,
  title,
  slug { current },
  description,
  publishedAt,
  readTime,
  tags,
  accentColor,
  theme,
  rawHtml,
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset -> { url }
    }
  },
  thumbnail {
    ...,
    asset -> { _ref, _type, url }
  }
`;

export async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const docs = await client.fetch(
      `*[_type == "blogPost"] | order(publishedAt desc) { ${BLOG_FIELDS} }`,
      {},
      { next: { revalidate: 60 } }
    );
    if (docs?.length) return docs.map(sanityDocToPost);
  } catch (err) {
    console.warn('[blog] Sanity fetch failed, using hardcoded posts:', err);
  }
  return getAllPosts();
}

export async function fetchPost(slug: string): Promise<BlogPost | undefined> {
  try {
    const doc = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0] { ${BLOG_FIELDS} }`,
      { slug },
      { next: { revalidate: 60 } }
    );
    if (doc) return sanityDocToPost(doc);
  } catch (err) {
    console.warn(`[blog] Sanity fetch failed for slug "${slug}", using hardcoded:`, err);
  }
  return getPost(slug);
}

export async function fetchAllSlugs(): Promise<string[]> {
  try {
    const docs = await client.fetch(
      `*[_type == "blogPost"]{ "slug": slug.current }`,
      {},
      { next: { revalidate: 3600 } }
    );
    if (docs?.length) return docs.map((d: { slug: string }) => d.slug);
  } catch {
    /* fallback */
  }
  return POSTS.map((p) => p.slug);
}
