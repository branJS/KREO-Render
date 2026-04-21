import type { Metadata } from "next";
import Link from "next/link";
import { getPost, getAllPosts } from "../../../lib/blog";
import { notFound } from "next/navigation";

const SITE_URL = "https://kreostudio.co.uk";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags.join(", "),
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["KREO Studio"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "KREO Studio",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "KREO Studio",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <main style={{ background: "var(--cream)", minHeight: "100vh", color: "var(--ink)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
          KREO
        </Link>
        <Link href="/blog" style={{
          fontWeight: 700, fontSize: "0.8rem", opacity: 0.5,
          letterSpacing: "0.1em", textDecoration: "none", color: "var(--ink)",
        }}>
          / Blog
        </Link>
        <span style={{ fontWeight: 600, fontSize: "0.75rem", opacity: 0.35 }}>
          / {post.tags[0]}
        </span>
      </nav>

      <article style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.2rem 5rem" }}>
        {/* Tags */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {post.tags.map((tag) => (
            <span key={tag} style={{
              fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", background: "var(--yellow)",
              border: "2px solid var(--ink)", padding: "0.15rem 0.5rem",
              boxShadow: "2px 2px 0 var(--ink)",
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 style={{
          margin: "0 0 1rem",
          fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
          fontWeight: 900, lineHeight: 1.15, letterSpacing: "0.02em",
        }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{
          display: "flex", gap: "1.2rem", marginBottom: "2rem",
          padding: "0.75rem 1rem",
          border: "2.5px solid var(--ink)", background: "#fff",
          boxShadow: "4px 4px 0 var(--ink)",
        }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, opacity: 0.55 }}>
            {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, opacity: 0.55 }}>
            {post.readTime}
          </span>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, opacity: 0.55 }}>
            KREO Studio — Plymouth
          </span>
        </div>

        {/* Content */}
        <div
          style={{ lineHeight: 1.75, fontWeight: 600, fontSize: "0.95rem" }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div style={{
          marginTop: "3rem",
          border: "3px solid var(--ink)",
          background: "var(--yellow)",
          boxShadow: "8px 8px 0 var(--ink)",
          padding: "1.4rem 1.6rem",
        }}>
          <p style={{ margin: "0 0 0.8rem", fontWeight: 800, fontSize: "1.05rem" }}>
            Work with KREO Studio — Plymouth&apos;s creative design studio
          </p>
          <p style={{ margin: "0 0 1rem", fontWeight: 600, fontSize: "0.85rem", opacity: 0.75 }}>
            Logo design, branding, website design, motion graphics and print — from £90. Based in Plymouth, serving the UK.
          </p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <Link href="/#contact" style={{
              background: "var(--ink)", color: "#fff", fontWeight: 800,
              border: "2.5px solid var(--ink)", padding: "0.65rem 1.1rem",
              textDecoration: "none", boxShadow: "4px 4px 0 rgba(0,0,0,0.3)",
            }}>
              Get a Quote →
            </Link>
            <Link href="/#pricing" style={{
              background: "var(--cream)", color: "var(--ink)", fontWeight: 800,
              border: "2.5px solid var(--ink)", padding: "0.65rem 1.1rem",
              textDecoration: "none", boxShadow: "4px 4px 0 var(--ink)",
            }}>
              View Pricing
            </Link>
          </div>
        </div>

        {/* Back */}
        <div style={{ marginTop: "1.5rem" }}>
          <Link href="/blog" style={{
            fontWeight: 700, fontSize: "0.85rem", color: "var(--ink)",
            textDecoration: "none", opacity: 0.5,
          }}>
            ← Back to Journal
          </Link>
        </div>
      </article>
    </main>
  );
}
