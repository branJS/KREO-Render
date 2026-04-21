import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://kreostudio.co.uk";

export const metadata: Metadata = {
  title: "Graphic Design Plymouth | KREO Studio — Brand, Print & Motion",
  description:
    "Professional graphic design in Plymouth, Devon. KREO Studio offers branding, logo design, print design, motion graphics and 3D renders for businesses across Plymouth, Cornwall and the South West. From £90.",
  keywords: [
    "graphic design plymouth",
    "graphic designer plymouth",
    "design studio plymouth",
    "graphic design devon",
    "freelance graphic designer plymouth",
    "branding plymouth",
    "print design plymouth",
    "creative agency plymouth",
  ],
  alternates: { canonical: `${SITE_URL}/graphic-design-plymouth` },
  openGraph: {
    title: "Graphic Design Plymouth | KREO Studio",
    description:
      "Professional graphic design in Plymouth — branding, logo design, print, motion and 3D. KREO Studio serves Plymouth, Devon and the wider UK.",
    url: `${SITE_URL}/graphic-design-plymouth`,
    type: "website",
  },
};

const FAQ = [
  {
    q: "How much does graphic design cost in Plymouth?",
    a: "Graphic design in Plymouth typically ranges from £90 for print items like flyers and business cards, to £250+ for logo design, £700+ for brand identity, and £900+ for website design. At KREO Studio, every project is quoted individually based on your brief.",
  },
  {
    q: "Do you work with clients outside Plymouth?",
    a: "Yes — KREO Studio is based in Plymouth but works with clients across Devon, Cornwall, the South West, Manchester, London and throughout the UK. All projects can be managed remotely.",
  },
  {
    q: "What graphic design services do you offer in Plymouth?",
    a: "KREO Studio offers logo design, brand identity, website design, label and packaging, motion graphics, 3D renders, social media design, flyer and brochure design, and business card design.",
  },
  {
    q: "How long does a graphic design project take?",
    a: "Timescales vary by project. A logo typically takes 1–2 weeks, a brand identity 2–4 weeks, and a website 3–6 weeks. Rush timelines are available on request.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      name: "KREO Studio",
      url: SITE_URL,
      description:
        "Graphic design studio in Plymouth, Devon. Specialising in branding, logo design, motion graphics, 3D renders, website design and print.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Plymouth",
        addressRegion: "Devon",
        addressCountry: "GB",
      },
      areaServed: [
        { "@type": "City", name: "Plymouth" },
        { "@type": "City", name: "Exeter" },
        { "@type": "City", name: "Truro" },
        { "@type": "AdministrativeArea", name: "Devon" },
        { "@type": "AdministrativeArea", name: "Cornwall" },
        { "@type": "Country", name: "United Kingdom" },
      ],
      priceRange: "££",
      sameAs: ["https://x.com/kreoxi"],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Graphic Design Plymouth",
          item: `${SITE_URL}/graphic-design-plymouth`,
        },
      ],
    },
  ],
};

const SERVICES = [
  { name: "Logo Design", from: "£250", desc: "Primary mark + variations, print & digital ready" },
  { name: "Brand Identity", from: "£700", desc: "Logo · guidelines · colour · typography · asset pack" },
  { name: "Print Design", from: "£90", desc: "Flyers, brochures, business cards, posters" },
  { name: "Label & Packaging", from: "£350", desc: "Print-ready artwork, full packaging design" },
  { name: "Motion Graphics", from: "£450", desc: "Animated assets, reels, social content" },
  { name: "3D Renders", from: "£250", desc: "Product · architectural · concept visualisation" },
  { name: "Social Media Design", from: "£180", desc: "On-brand, sized and ready to post" },
  { name: "Website Design", from: "£900", desc: "Custom design + build, mobile-first" },
];

export default function GraphicDesignPlymouth() {
  return (
    <main style={{ background: "var(--cream)", minHeight: "100vh", color: "var(--ink)", fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* NAV */}
      <nav style={{
        borderBottom: "3px solid var(--ink)", padding: "0.75rem 1.2rem",
        display: "flex", alignItems: "center", gap: "1rem",
        background: "var(--cream)", position: "sticky", top: 0, zIndex: 10,
      }}>
        <Link href="/" style={{
          fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.12em",
          textDecoration: "none", color: "var(--ink)",
          border: "2.5px solid var(--ink)", padding: "0.3rem 0.7rem",
          boxShadow: "3px 3px 0 var(--ink)",
        }}>
          ← KREO
        </Link>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.2rem 5rem" }}>

        {/* Hero */}
        <div style={{
          border: "3px solid var(--ink)", background: "var(--yellow)",
          boxShadow: "12px 12px 0 var(--ink)", padding: "2.5rem 2rem",
          marginBottom: "2rem",
        }}>
          <nav aria-label="breadcrumb" style={{ marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, opacity: 0.5 }}>
              <Link href="/" style={{ color: "var(--ink)", textDecoration: "none" }}>Home</Link>
              {" / "}Graphic Design Plymouth
            </span>
          </nav>
          <h1 style={{ margin: "0 0 0.75rem", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "0.02em" }}>
            Graphic Design<br />Plymouth
          </h1>
          <p style={{ margin: "0 0 1.5rem", fontWeight: 600, fontSize: "1.05rem", opacity: 0.75, maxWidth: 580, lineHeight: 1.6 }}>
            KREO Studio is Plymouth&apos;s creative design practice — delivering branding, logo design, motion graphics, 3D renders, print and web design for businesses across Devon, Cornwall and the UK.
          </p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <Link href="/#contact" style={{
              background: "var(--ink)", color: "#fff", fontWeight: 800,
              border: "2.5px solid var(--ink)", padding: "0.75rem 1.3rem",
              textDecoration: "none", boxShadow: "4px 4px 0 rgba(0,0,0,0.25)", fontSize: "0.95rem",
            }}>
              Get a Free Quote →
            </Link>
            <Link href="/#pricing" style={{
              background: "var(--cream)", color: "var(--ink)", fontWeight: 800,
              border: "2.5px solid var(--ink)", padding: "0.75rem 1.3rem",
              textDecoration: "none", boxShadow: "4px 4px 0 var(--ink)", fontSize: "0.95rem",
            }}>
              View Pricing
            </Link>
          </div>
        </div>

        {/* About block */}
        <div style={{
          border: "3px solid var(--ink)", background: "#fff",
          boxShadow: "8px 8px 0 var(--ink)", padding: "1.8rem 2rem",
          marginBottom: "2rem",
        }}>
          <h2 style={{ margin: "0 0 0.8rem", fontWeight: 900, fontSize: "1.4rem" }}>
            Plymouth&apos;s Creative Studio — Visuals, Motion &amp; Interaction
          </h2>
          <p style={{ margin: "0 0 0.8rem", fontWeight: 600, lineHeight: 1.7, opacity: 0.8 }}>
            Based in Plymouth, Devon, KREO Studio works with startups, established businesses, musicians, hospitality brands and independent traders who want design that genuinely stands out. Our work spans from high-impact logo design to full brand identity systems, print production, motion graphics and bespoke website builds.
          </p>
          <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.7, opacity: 0.8 }}>
            Whether you&apos;re launching a new business in Plymouth, rebranding an existing one, or need creative assets for a campaign — we deliver work that connects with your customers and holds up under scrutiny.
          </p>
        </div>

        {/* Services grid */}
        <h2 style={{ margin: "0 0 1rem", fontWeight: 900, fontSize: "1.3rem" }}>
          Graphic Design Services — Plymouth &amp; Devon
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "0.75rem", marginBottom: "2.5rem",
        }}>
          {SERVICES.map(({ name, from, desc }) => (
            <div key={name} style={{
              border: "3px solid var(--ink)", background: "#fff",
              boxShadow: "6px 6px 0 var(--ink)", padding: "1rem",
            }}>
              <div style={{ fontWeight: 900, fontSize: "0.95rem", marginBottom: "0.25rem" }}>{name}</div>
              <div style={{ fontWeight: 600, fontSize: "0.78rem", opacity: 0.55, marginBottom: "0.5rem", lineHeight: 1.4 }}>{desc}</div>
              <div style={{ fontWeight: 900, fontSize: "1.05rem" }}>
                From {from}
              </div>
            </div>
          ))}
        </div>

        {/* Area coverage */}
        <div style={{
          border: "3px solid var(--ink)", background: "var(--cream)",
          boxShadow: "8px 8px 0 var(--ink)", padding: "1.4rem 1.8rem",
          marginBottom: "2.5rem",
        }}>
          <h2 style={{ margin: "0 0 0.6rem", fontWeight: 900, fontSize: "1.1rem" }}>
            Areas We Serve
          </h2>
          <p style={{ margin: 0, fontWeight: 600, opacity: 0.7, lineHeight: 1.8 }}>
            Plymouth · Plymstock · Plympton · Saltash · Torpoint · Ivybridge · Tavistock · Totnes · Exeter · Newton Abbot · Truro · Cornwall · South Devon · North Devon · Bristol · Manchester · London · UK &amp; Europe
          </p>
        </div>

        {/* FAQ */}
        <h2 style={{ margin: "0 0 1rem", fontWeight: 900, fontSize: "1.3rem" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "grid", gap: "0.75rem", marginBottom: "2.5rem" }}>
          {FAQ.map(({ q, a }) => (
            <div key={q} style={{
              border: "3px solid var(--ink)", background: "#fff",
              boxShadow: "6px 6px 0 var(--ink)", padding: "1.1rem 1.3rem",
            }}>
              <p style={{ margin: "0 0 0.4rem", fontWeight: 800, fontSize: "0.95rem" }}>{q}</p>
              <p style={{ margin: 0, fontWeight: 600, opacity: 0.7, fontSize: "0.88rem", lineHeight: 1.65 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* Related links */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          <Link href="/logo-design-plymouth" style={{
            fontWeight: 700, fontSize: "0.82rem", color: "var(--ink)",
            border: "2.5px solid var(--ink)", padding: "0.4rem 0.8rem",
            textDecoration: "none", boxShadow: "3px 3px 0 var(--ink)", background: "#fff",
          }}>
            Logo Design Plymouth →
          </Link>
          <Link href="/web-design-plymouth" style={{
            fontWeight: 700, fontSize: "0.82rem", color: "var(--ink)",
            border: "2.5px solid var(--ink)", padding: "0.4rem 0.8rem",
            textDecoration: "none", boxShadow: "3px 3px 0 var(--ink)", background: "#fff",
          }}>
            Web Design Plymouth →
          </Link>
          <Link href="/blog" style={{
            fontWeight: 700, fontSize: "0.82rem", color: "var(--ink)",
            border: "2.5px solid var(--ink)", padding: "0.4rem 0.8rem",
            textDecoration: "none", boxShadow: "3px 3px 0 var(--ink)", background: "#fff",
          }}>
            Design Blog →
          </Link>
        </div>

      </div>
    </main>
  );
}
