import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://kreostudio.co.uk";

export const metadata: Metadata = {
  title: "Website Design Plymouth | Custom Web Design Devon | KREO Studio",
  description:
    "Professional website design in Plymouth, Devon. KREO Studio builds custom, fast, mobile-first websites for Plymouth businesses from £900. Local designer, national reach.",
  keywords: [
    "website design plymouth",
    "web design plymouth",
    "web designer plymouth",
    "website designer plymouth devon",
    "custom website plymouth",
    "web design south west",
    "small business website plymouth",
  ],
  alternates: { canonical: `${SITE_URL}/web-design-plymouth` },
  openGraph: {
    title: "Website Design Plymouth | KREO Studio",
    description:
      "Custom website design for Plymouth businesses — fast, mobile-first, SEO-ready. From £900. KREO Studio, Plymouth, Devon.",
    url: `${SITE_URL}/web-design-plymouth`,
    type: "website",
  },
};

const FAQ = [
  {
    q: "How much does website design cost in Plymouth?",
    a: "Website design in Plymouth varies from around £500 for basic template customisation to £5,000+ for complex bespoke builds. KREO Studio's website design starts from £900, which includes custom design, mobile-first development, local SEO foundations, and a contact form.",
  },
  {
    q: "How long does a website take to build?",
    a: "A typical KREO website project takes 3–6 weeks from brief to launch. Timeline depends on content readiness, revision rounds, and project complexity. We'll agree a schedule before we start.",
  },
  {
    q: "Do you build websites that rank on Google?",
    a: "Yes — every KREO website is built with local SEO foundations: proper meta titles, descriptions, structured data (JSON-LD), sitemap.xml, fast loading, and mobile optimisation. We also set up Google Analytics and Google Search Console.",
  },
  {
    q: "Will my website work on mobile?",
    a: "Every website we build is mobile-first by design. We build with modern frameworks (Next.js/React) that are inherently responsive, fast, and perform well on all devices — which also helps your Google rankings.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      name: "KREO Studio",
      url: SITE_URL,
      description: "Website and web design studio in Plymouth, Devon.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Plymouth",
        addressRegion: "Devon",
        addressCountry: "GB",
      },
      priceRange: "££",
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
        { "@type": "ListItem", position: 2, name: "Website Design Plymouth", item: `${SITE_URL}/web-design-plymouth` },
      ],
    },
  ],
};

const INCLUDES = [
  "Custom design — no templates or page builders",
  "Mobile-first, fully responsive layout",
  "Local SEO foundations (meta, structured data, sitemap)",
  "Fast load times — built on Next.js",
  "Contact form with email delivery",
  "Google Analytics + Search Console setup",
  "30-day post-launch support",
  "Full ownership of your site files",
];

export default function WebDesignPlymouth() {
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
          border: "3px solid var(--ink)", background: "#1E6FE0",
          boxShadow: "12px 12px 0 var(--ink)", padding: "2.5rem 2rem", marginBottom: "2rem",
        }}>
          <nav aria-label="breadcrumb" style={{ marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Home</Link>
              {" / "}Website Design Plymouth
            </span>
          </nav>
          <h1 style={{ margin: "0 0 0.75rem", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.05, color: "#fff" }}>
            Website Design<br />Plymouth
          </h1>
          <p style={{ margin: "0 0 1.5rem", fontWeight: 600, fontSize: "1rem", color: "rgba(255,255,255,0.8)", maxWidth: 540, lineHeight: 1.6 }}>
            KREO Studio builds fast, beautiful, custom websites for Plymouth businesses. No templates. No page builders. Just clean, purposeful design that gets results.
          </p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <Link href="/#contact" style={{
              background: "var(--yellow)", color: "var(--ink)", fontWeight: 800,
              border: "2.5px solid var(--ink)", padding: "0.75rem 1.3rem",
              textDecoration: "none", boxShadow: "4px 4px 0 rgba(0,0,0,0.3)",
            }}>
              Get a Quote →
            </Link>
            <Link href="/#projects" style={{
              background: "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 800,
              border: "2.5px solid rgba(255,255,255,0.5)", padding: "0.75rem 1.3rem",
              textDecoration: "none",
            }}>
              View Portfolio
            </Link>
          </div>
        </div>

        {/* What's included */}
        <div style={{
          border: "3px solid var(--ink)", background: "#fff",
          boxShadow: "8px 8px 0 var(--ink)", padding: "1.8rem 2rem", marginBottom: "2rem",
        }}>
          <h2 style={{ margin: "0 0 1rem", fontWeight: 900, fontSize: "1.35rem" }}>
            Every KREO Website Includes
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: "0.5rem" }}>
            {INCLUDES.map(item => (
              <div key={item} style={{
                display: "flex", alignItems: "flex-start", gap: "0.5rem",
                fontWeight: 600, fontSize: "0.88rem", lineHeight: 1.5,
              }}>
                <span style={{
                  display: "inline-block", width: 8, height: 8, background: "var(--teal)",
                  border: "2px solid var(--ink)", flexShrink: 0, marginTop: "0.3rem",
                }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Why local */}
        <div style={{
          border: "3px solid var(--ink)", background: "var(--yellow)",
          boxShadow: "8px 8px 0 var(--ink)", padding: "1.6rem 1.8rem", marginBottom: "2rem",
        }}>
          <h2 style={{ margin: "0 0 0.7rem", fontWeight: 900, fontSize: "1.2rem" }}>
            Why Choose a Plymouth Web Designer?
          </h2>
          <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.7, opacity: 0.8 }}>
            Working with a local Plymouth web designer means direct communication, local market knowledge, and no timezone gaps or language barriers. You&apos;re working with the person building your site — not a project manager relaying feedback to a team overseas. Every KREO website is built with Plymouth businesses in mind, with local SEO baked in from day one.
          </p>
        </div>

        {/* Process */}
        <h2 style={{ margin: "0 0 1rem", fontWeight: 900, fontSize: "1.3rem" }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "0.75rem", marginBottom: "2.5rem" }}>
          {[
            { step: "01", title: "Brief", desc: "We discuss your business, goals, and customers. What success looks like." },
            { step: "02", title: "Design", desc: "Custom layouts crafted to your brand. You review and approve before build." },
            { step: "03", title: "Build", desc: "Developed on Next.js — fast, clean, SEO-ready. Full mobile testing." },
            { step: "04", title: "Launch", desc: "Go live with Google Analytics, Search Console, and 30 days of support." },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{
              border: "3px solid var(--ink)", background: "#fff",
              boxShadow: "5px 5px 0 var(--ink)", padding: "1rem",
            }}>
              <div style={{ fontWeight: 900, fontSize: "1.6rem", opacity: 0.15, lineHeight: 1 }}>{step}</div>
              <div style={{ fontWeight: 900, fontSize: "1rem", margin: "0.2rem 0 0.3rem" }}>{title}</div>
              <div style={{ fontWeight: 600, fontSize: "0.82rem", opacity: 0.65, lineHeight: 1.55 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ margin: "0 0 1rem", fontWeight: 900, fontSize: "1.3rem" }}>Website Design FAQ — Plymouth</h2>
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

        {/* Related */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link href="/graphic-design-plymouth" style={{
            fontWeight: 700, fontSize: "0.82rem", color: "var(--ink)",
            border: "2.5px solid var(--ink)", padding: "0.4rem 0.8rem",
            textDecoration: "none", boxShadow: "3px 3px 0 var(--ink)", background: "#fff",
          }}>Graphic Design Plymouth →</Link>
          <Link href="/logo-design-plymouth" style={{
            fontWeight: 700, fontSize: "0.82rem", color: "var(--ink)",
            border: "2.5px solid var(--ink)", padding: "0.4rem 0.8rem",
            textDecoration: "none", boxShadow: "3px 3px 0 var(--ink)", background: "#fff",
          }}>Logo Design Plymouth →</Link>
          <Link href="/blog/web-design-plymouth-local" style={{
            fontWeight: 700, fontSize: "0.82rem", color: "var(--ink)",
            border: "2.5px solid var(--ink)", padding: "0.4rem 0.8rem",
            textDecoration: "none", boxShadow: "3px 3px 0 var(--ink)", background: "#fff",
          }}>Web Design Guide →</Link>
        </div>

      </div>
    </main>
  );
}
