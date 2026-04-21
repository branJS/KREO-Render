import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://brandonallen.uk";

export const metadata: Metadata = {
  title: "Logo Design Plymouth | Professional Logo Designer Devon | KREO",
  description:
    "Expert logo design in Plymouth, Devon. KREO Studio creates distinctive logos, brand marks and identity systems for Plymouth businesses from £250. Free quote available.",
  keywords: [
    "logo design plymouth",
    "logo designer plymouth",
    "logo plymouth",
    "professional logo design devon",
    "brand logo plymouth",
    "logo design south west",
    "freelance logo designer plymouth",
  ],
  alternates: { canonical: `${SITE_URL}/logo-design-plymouth` },
  openGraph: {
    title: "Logo Design Plymouth | KREO Studio",
    description:
      "Professional logo design in Plymouth, Devon — from £250. KREO Studio creates distinctive logos and brand marks for Plymouth businesses.",
    url: `${SITE_URL}/logo-design-plymouth`,
    type: "website",
  },
};

const FAQ = [
  {
    q: "How much does a logo cost in Plymouth?",
    a: "A professional logo design in Plymouth typically costs between £150 and £500 for a freelance designer, and more for larger agencies. KREO Studio's logo design starts from £250, which includes multiple concepts, revisions, and full file delivery in all formats.",
  },
  {
    q: "What file formats will I receive with my logo?",
    a: "You'll receive your logo in all formats needed: SVG (vector, infinitely scalable), PNG (transparent background, web use), PDF (print-ready), and AI or EPS source files. All colour variants — full colour, reversed, black and white — are included.",
  },
  {
    q: "How long does logo design take in Plymouth?",
    a: "A standard logo project with KREO takes 1–2 weeks from brief to final delivery. Rush timelines of 2–5 days are available for an additional fee.",
  },
  {
    q: "Do you offer full brand identity alongside logo design?",
    a: "Yes — if you need more than a logo, our brand identity package (from £700) includes the logo suite, brand guidelines, colour palette, typography selection, and a full digital and print asset pack.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      name: "KREO Studio",
      url: SITE_URL,
      description: "Logo design and brand identity studio in Plymouth, Devon.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Plymouth",
        addressRegion: "Devon",
        addressCountry: "GB",
      },
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
        { "@type": "ListItem", position: 2, name: "Logo Design Plymouth", item: `${SITE_URL}/logo-design-plymouth` },
      ],
    },
  ],
};

const PACKAGES = [
  {
    name: "Logo Design",
    price: "From £250",
    color: "var(--yellow)",
    items: ["3 initial concepts", "Primary mark + icon variant", "Horizontal & stacked versions", "All file formats (SVG, PNG, PDF, AI)", "3 revision rounds"],
  },
  {
    name: "Logo + Brand Identity",
    price: "From £700",
    color: "var(--teal)",
    items: ["Everything in Logo Design", "Brand colour palette", "Typography selection", "Brand guidelines PDF", "Full digital + print asset pack"],
  },
];

export default function LogoDesignPlymouth() {
  return (
    <main style={{ background: "var(--cream)", minHeight: "100vh", color: "var(--ink)", fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
          border: "3px solid var(--ink)", background: "var(--teal)",
          boxShadow: "12px 12px 0 var(--ink)", padding: "2.5rem 2rem", marginBottom: "2rem",
        }}>
          <nav aria-label="breadcrumb" style={{ marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, opacity: 0.6 }}>
              <Link href="/" style={{ color: "var(--ink)", textDecoration: "none" }}>Home</Link>
              {" / "}Logo Design Plymouth
            </span>
          </nav>
          <h1 style={{ margin: "0 0 0.75rem", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.05 }}>
            Logo Design<br />Plymouth
          </h1>
          <p style={{ margin: "0 0 1.5rem", fontWeight: 600, fontSize: "1rem", opacity: 0.8, maxWidth: 540, lineHeight: 1.6 }}>
            A great logo is the foundation of every strong brand. KREO Studio designs distinctive, strategic logos for Plymouth businesses — marks that look great on screen, in print, and at every size.
          </p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <Link href="/#contact" style={{
              background: "var(--ink)", color: "#fff", fontWeight: 800,
              border: "2.5px solid var(--ink)", padding: "0.75rem 1.3rem",
              textDecoration: "none", boxShadow: "4px 4px 0 rgba(0,0,0,0.25)",
            }}>
              Start Your Logo →
            </Link>
            <Link href="/#projects" style={{
              background: "var(--cream)", color: "var(--ink)", fontWeight: 800,
              border: "2.5px solid var(--ink)", padding: "0.75rem 1.3rem",
              textDecoration: "none", boxShadow: "4px 4px 0 var(--ink)",
            }}>
              View Portfolio
            </Link>
          </div>
        </div>

        {/* What makes a great logo */}
        <div style={{
          border: "3px solid var(--ink)", background: "#fff",
          boxShadow: "8px 8px 0 var(--ink)", padding: "1.8rem 2rem", marginBottom: "2rem",
        }}>
          <h2 style={{ margin: "0 0 0.8rem", fontWeight: 900, fontSize: "1.35rem" }}>
            What Makes a Great Plymouth Business Logo?
          </h2>
          <p style={{ margin: "0 0 0.75rem", fontWeight: 600, lineHeight: 1.7, opacity: 0.8 }}>
            The best logos are deceptively simple. They communicate your brand&apos;s personality at a glance, scale from a business card to a billboard, work in black and white as well as colour, and stay relevant for years — not just months.
          </p>
          <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.7, opacity: 0.8 }}>
            At KREO Studio, we approach logo design strategically — starting with your business, your customers, and your market before we open Illustrator. Every decision, from typeface to symbol to colour, is made with intent.
          </p>
        </div>

        {/* Packages */}
        <h2 style={{ margin: "0 0 1rem", fontWeight: 900, fontSize: "1.3rem" }}>Logo Design Packages</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          {PACKAGES.map(({ name, price, color, items }) => (
            <div key={name} style={{
              border: "3px solid var(--ink)", borderTop: `5px solid ${color}`,
              background: "#fff", boxShadow: "8px 8px 0 var(--ink)", padding: "1.3rem 1.4rem",
            }}>
              <div style={{ fontWeight: 900, fontSize: "1.05rem", marginBottom: "0.3rem" }}>{name}</div>
              <div style={{ fontWeight: 900, fontSize: "1.5rem", marginBottom: "0.8rem" }}>{price}</div>
              <ul style={{ margin: 0, padding: "0 0 0 1.1rem", display: "grid", gap: "0.3rem" }}>
                {items.map(item => (
                  <li key={item} style={{ fontWeight: 600, fontSize: "0.85rem", opacity: 0.75, lineHeight: 1.5 }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ margin: "0 0 1rem", fontWeight: 900, fontSize: "1.3rem" }}>Logo Design FAQ — Plymouth</h2>
        <div style={{ display: "grid", gap: "0.75rem", marginBottom: "2.5rem" }}>
          {FAQ.map(({ q, a }) => (
            <div key={q} style={{
              border: "3px solid var(--ink)", background: "#fff",
              boxShadow: "5px 5px 0 var(--ink)", padding: "1.1rem 1.3rem",
            }}>
              <p style={{ margin: "0 0 0.35rem", fontWeight: 800, fontSize: "0.95rem" }}>{q}</p>
              <p style={{ margin: 0, fontWeight: 600, opacity: 0.7, fontSize: "0.87rem", lineHeight: 1.65 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* Related links */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link href="/graphic-design-plymouth" style={{
            fontWeight: 700, fontSize: "0.82rem", color: "var(--ink)",
            border: "2.5px solid var(--ink)", padding: "0.4rem 0.8rem",
            textDecoration: "none", boxShadow: "3px 3px 0 var(--ink)", background: "#fff",
          }}>Graphic Design Plymouth →</Link>
          <Link href="/web-design-plymouth" style={{
            fontWeight: 700, fontSize: "0.82rem", color: "var(--ink)",
            border: "2.5px solid var(--ink)", padding: "0.4rem 0.8rem",
            textDecoration: "none", boxShadow: "3px 3px 0 var(--ink)", background: "#fff",
          }}>Web Design Plymouth →</Link>
          <Link href="/blog/logo-design-cost-plymouth" style={{
            fontWeight: 700, fontSize: "0.82rem", color: "var(--ink)",
            border: "2.5px solid var(--ink)", padding: "0.4rem 0.8rem",
            textDecoration: "none", boxShadow: "3px 3px 0 var(--ink)", background: "#fff",
          }}>Logo Design Cost Guide →</Link>
        </div>

      </div>
    </main>
  );
}
