import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "../../lib/blog";

const SITE_URL = "https://brandonallen.uk";

export const metadata: Metadata = {
  title: "Blog — Graphic Design & Branding Insights | KREO Plymouth",
  description:
    "Design tips, branding advice, and local insights for Plymouth businesses. From logo design costs to web design strategy — the KREO Studio blog.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Blog — KREO Studio Plymouth",
    description:
      "Design tips, branding advice, and local insights from KREO Studio, Plymouth's graphic design and motion studio.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main style={{ background: "var(--cream)", minHeight: "100vh", color: "var(--ink)" }}>
      {/* NAV */}
      <nav style={{
        borderBottom: "3px solid var(--ink)",
        padding: "0.75rem 1.2rem",
        display: "flex", alignItems: "center", gap: "1rem",
        background: "var(--cream)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <Link href="/" style={{
          fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.12em",
          textDecoration: "none", color: "var(--ink)",
          border: "2.5px solid var(--ink)", padding: "0.3rem 0.7rem",
          boxShadow: "3px 3px 0 var(--ink)",
        }}>
          ← KREO
        </Link>
        <span style={{ fontWeight: 700, fontSize: "0.8rem", opacity: 0.5, letterSpacing: "0.1em" }}>
          / BLOG
        </span>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1.2rem 4rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.6rem" }}>
            <h1 style={{
              margin: 0, fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 900, letterSpacing: "0.04em", lineHeight: 1,
            }}>
              Journal
            </h1>
            <span style={{
              background: "var(--yellow)", border: "2.5px solid var(--ink)",
              boxShadow: "3px 3px 0 var(--ink)", padding: "0.2rem 0.6rem",
              fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              Plymouth Design
            </span>
          </div>
          <p style={{ margin: 0, fontWeight: 600, opacity: 0.6, maxWidth: 540, lineHeight: 1.6 }}>
            Design thinking, branding strategy, and plain-English guidance for businesses in Plymouth, Devon, and beyond.
          </p>
        </div>

        {/* Post list */}
        <div style={{ display: "grid", gap: "1rem" }}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article style={{
                border: "3px solid var(--ink)",
                background: "#fff",
                boxShadow: "8px 8px 0 var(--ink)",
                padding: "1.2rem 1.4rem",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "1rem",
                alignItems: "start",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translate(-3px,-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "12px 12px 0 var(--ink)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "8px 8px 0 var(--ink)";
              }}
              >
                <div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{
                        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em",
                        textTransform: "uppercase", background: "var(--cream)",
                        border: "2px solid var(--ink)", padding: "0.1rem 0.4rem",
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 style={{ margin: "0 0 0.4rem", fontSize: "1.1rem", fontWeight: 800, lineHeight: 1.3 }}>
                    {post.title}
                  </h2>
                  <p style={{ margin: 0, fontSize: "0.84rem", fontWeight: 600, opacity: 0.6, lineHeight: 1.55 }}>
                    {post.description}
                  </p>
                </div>
                <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, opacity: 0.45 }}>
                    {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 600, opacity: 0.35, marginTop: "0.2rem" }}>
                    {post.readTime}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: "3rem", border: "3px solid var(--ink)",
          background: "var(--yellow)", boxShadow: "8px 8px 0 var(--ink)",
          padding: "1.4rem 1.6rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <p style={{ margin: "0 0 0.25rem", fontWeight: 800, fontSize: "1rem" }}>
              Need a graphic designer in Plymouth?
            </p>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.82rem", opacity: 0.7 }}>
              KREO Studio — branding, motion, web &amp; print from Plymouth, Devon.
            </p>
          </div>
          <Link href="/#contact" style={{
            background: "var(--ink)", color: "#fff", fontWeight: 800,
            border: "2.5px solid var(--ink)", padding: "0.7rem 1.2rem",
            textDecoration: "none", boxShadow: "4px 4px 0 rgba(0,0,0,0.3)",
            fontSize: "0.9rem",
          }}>
            Get a Quote →
          </Link>
        </div>
      </div>
    </main>
  );
}
