"use client";

import { useRef } from "react";
import { getAllPosts } from "../../lib/blog";
import { TransitionLink, useKreoNav } from "./KreoTransition";

/* ═══════════════════════════════════════════════════════════════════════════
   KREO HOME — JOURNAL SECTION
   Shows the 3 latest blog posts in accent cards.
   Styled to match Reviews / Twitter sections.
═══════════════════════════════════════════════════════════════════════════ */

export default function BlogSection() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section id="blog" className="section">
      <div className="panel" data-sr>
        {/* Header */}
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Journal</h2>
          <TransitionLink
            href="/blog"
            className="btn b-yellow tiny"
            style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)", textDecoration: "none" }}
          >
            All Articles →
          </TransitionLink>
        </div>

        <p style={{
          fontWeight: 600, fontSize: "0.82rem",
          opacity: 0.55, margin: "0 0 1.4rem",
          maxWidth: 480, lineHeight: 1.65,
        }}>
          Design thinking, brand strategy &amp; plain-English guidance — from Plymouth.
        </p>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
          gap: "0.9rem",
        }}>
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        {/* CTA strip */}
        <div style={{
          marginTop: "1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.8rem",
          padding: "1rem 1.2rem",
          background: "var(--ink)",
          border: "3px solid var(--ink)",
          boxShadow: "6px 6px 0 var(--yellow)",
        }}>
          <div style={{ color: "#fff" }}>
            <p style={{ margin: "0 0 0.2rem", fontWeight: 900, fontSize: "0.9rem" }}>
              Read the KREO Journal
            </p>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.75rem", opacity: 0.6 }}>
              Design thinking &amp; brand strategy — updated regularly.
            </p>
          </div>
          <TransitionLink
            href="/blog"
            style={{
              background: "var(--yellow)", color: "var(--ink)",
              fontWeight: 800, fontSize: "0.85rem",
              border: "2.5px solid var(--yellow)",
              padding: "0.6rem 1.1rem",
              textDecoration: "none",
              boxShadow: "3px 3px 0 rgba(255,255,255,0.15)",
              whiteSpace: "nowrap",
            }}
          >
            Open Journal →
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}

/* ── Individual card ── */
function BlogCard({ post, index }: { post: ReturnType<typeof getAllPosts>[number]; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const accent = post.accentColor ?? "var(--yellow)";
  const { navigate } = useKreoNav();

  const onMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -12;
    el.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) translateZ(4px) translate(-2px,-2px)`;
    el.style.boxShadow = `10px 10px 0 var(--ink)`;
  };
  const onMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.boxShadow = "";
  };

  return (
    <a
      ref={cardRef}
      href={`/blog/${post.slug}`}
      onClick={(e) => { e.preventDefault(); navigate(`/blog/${post.slug}`); }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        display: "block",
        border: "3px solid var(--ink)",
        background: "#fff",
        boxShadow: "6px 6px 0 var(--ink)",
        textDecoration: "none",
        color: "var(--ink)",
        willChange: "transform",
        overflow: "hidden",
      }}
    >
      {/* Thumbnail or accent bar */}
      {post.thumbnail ? (
        <div style={{ height: 120, overflow: "hidden", borderBottom: "3px solid var(--ink)", position: "relative" }}>
          <img
            src={post.thumbnail}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: accent }} />
        </div>
      ) : (
        <div style={{ height: 4, background: accent }} />
      )}

      <div style={{ padding: "1rem 1rem 1.1rem" }}>
        {/* Tags */}
        <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          {post.tags.slice(0, 2).map(t => (
            <span key={t} style={{
              fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.1em",
              textTransform: "uppercase", background: "var(--cream)",
              border: "1.5px solid var(--ink)", padding: "0.1rem 0.35rem",
            }}>{t}</span>
          ))}
        </div>

        {/* Title */}
        <h3 style={{
          margin: "0 0 0.45rem",
          fontSize: "clamp(0.85rem, 2vw, 0.98rem)",
          fontWeight: 900, lineHeight: 1.3,
        }}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p style={{
          margin: "0 0 0.8rem",
          fontSize: "0.75rem", fontWeight: 600,
          opacity: 0.55, lineHeight: 1.55,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as const,
          overflow: "hidden",
        }}>
          {post.description}
        </p>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.62rem", fontWeight: 700, opacity: 0.4 }}>
            {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            &nbsp;·&nbsp;{post.readTime}
          </span>
          <span style={{
            fontWeight: 800, fontSize: "0.7rem",
            border: "2px solid var(--ink)", padding: "0.15rem 0.4rem",
            background: accent,
          }}>→</span>
        </div>
      </div>
    </a>
  );
}
