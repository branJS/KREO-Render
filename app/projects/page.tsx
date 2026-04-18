"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const builder = imageUrlBuilder(client as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) { return builder.image(source); }

export const dynamic = "force-dynamic";

const QUERY = groq`*[_type == "project" && !(_id in path("drafts.**"))] | order(featured desc, order asc, publishedAt desc) {
  _id, title, "slug": slug.current, category, description, coverImage, featured, tags
}`;

const CAT_COLORS: Record<string, string> = {
  branding: "#F5C100",
  motion: "#00B6A3",
  "3d": "#1E6FE0",
  print: "#2DBA72",
  uiux: "#E56BE3",
  other: "#E24C3A",
};

const ALL_CATS = ["all", "branding", "motion", "3d", "print", "uiux", "other"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProjectCard({ project, index }: { project: any; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isFeatured = project.featured;
  const catColor = CAT_COLORS[project.category?.toLowerCase()] ?? "#0D0D0D";

  const coverUrl = project.coverImage
    ? urlFor(project.coverImage).width(isFeatured ? 1200 : 700).height(isFeatured ? 700 : 500).url()
    : null;

  return (
    <Link
      href={`/projects/${project.slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          overflow: "hidden",
          border: "3px solid var(--ink)",
          boxShadow: hovered ? "14px 14px 0 var(--ink)" : "6px 6px 0 var(--ink)",
          transform: hovered ? "translate(-4px,-4px)" : "translate(0,0)",
          transition: "transform 0.22s ease, box-shadow 0.22s ease",
          cursor: "none",
          height: isFeatured ? "480px" : "300px",
          background: "#fff",
          animation: `fadeSlideUp 0.5s ease both`,
          animationDelay: `${index * 0.06}s`,
        }}
      >
        {/* Image */}
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={project.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: `linear-gradient(145deg, ${catColor}22 0%, ${catColor}66 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "4rem", fontWeight: 800, color: catColor, opacity: 0.35 }}>
              {project.title?.[0] ?? "K"}
            </span>
          </div>
        )}

        {/* Scrim */}
        <div style={{
          position: "absolute", inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.5) 55%, transparent 100%)"
            : "linear-gradient(to top, rgba(13,13,13,0.6) 0%, transparent 55%)",
          transition: "background 0.3s ease",
        }} />

        {/* Category badge (top left) */}
        <div style={{
          position: "absolute", top: "1rem", left: "1rem",
          background: catColor, color: "#0D0D0D",
          border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)",
          fontWeight: 800, fontSize: "0.62rem", padding: "3px 9px",
          letterSpacing: "0.12em", textTransform: "uppercase",
          opacity: hovered ? 0 : 1,
          transition: "opacity 0.2s ease",
        }}>
          {project.category?.replace(/-/g, " ").replace("3d", "3D") || "Project"}
        </div>

        {/* Featured badge */}
        {isFeatured && (
          <div style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "#F5C100", color: "#0D0D0D",
            border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)",
            fontWeight: 800, fontSize: "0.62rem", padding: "3px 9px",
            letterSpacing: "0.1em",
          }}>
            ★ FEATURED
          </div>
        )}

        {/* Bottom overlay content */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: isFeatured ? "2rem 2.2rem" : "1.2rem 1.4rem",
        }}>
          {/* Category + title always show */}
          <div style={{
            display: "inline-block",
            background: catColor, color: "#0D0D0D",
            border: "2px solid rgba(255,255,255,0.5)", fontWeight: 800,
            fontSize: "0.6rem", padding: "3px 8px",
            letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: "0.4rem",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}>
            {project.category?.replace(/-/g, " ").replace("3d", "3D") || "Project"}
          </div>

          <h3 style={{
            color: "#fff", margin: 0, lineHeight: 1.15,
            fontSize: isFeatured ? "2rem" : "1.15rem",
            fontWeight: 800, letterSpacing: "0.02em",
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}>
            {project.title}
          </h3>

          {/* Description + CTA slide in on hover */}
          <div style={{
            overflow: "hidden",
            maxHeight: hovered ? "120px" : "0",
            opacity: hovered ? 1 : 0,
            transition: "max-height 0.35s ease, opacity 0.28s ease",
            marginTop: hovered ? "0.6rem" : 0,
          }}>
            {project.description && (
              <p style={{
                color: "rgba(255,255,255,0.75)", fontWeight: 600,
                fontSize: "0.88rem", margin: "0 0 0.9rem", lineHeight: 1.55,
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {project.description}
              </p>
            )}
            <span style={{
              display: "inline-block",
              background: "#fff", color: "#0D0D0D", fontWeight: 800,
              fontSize: "0.8rem", padding: "0.4rem 1rem",
              border: "2px solid #fff", letterSpacing: "0.08em",
            }}>
              OPEN PROJECT →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    client.fetch(QUERY)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => { setProjects(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((p) => p.category?.toLowerCase() === activeFilter);
  }, [projects, activeFilter]);

  // Get categories that actually exist
  const existingCats = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category?.toLowerCase()).filter(Boolean));
    return ["all", ...ALL_CATS.slice(1).filter((c) => cats.has(c))];
  }, [projects]);

  const featured = filtered.filter((p) => p.featured);
  const regular = filtered.filter((p) => !p.featured);

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
      `}</style>

      <main style={{ minHeight: "100vh", paddingTop: "5rem" }}>

        {/* ── Header ── */}
        <div className="section" style={{ paddingBottom: 0 }}>
          <div style={{
            maxWidth: 1100, margin: "0 auto",
            borderBottom: "3px solid var(--ink)",
            paddingBottom: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                  <Link href="/" style={{
                    color: "var(--muted)", fontWeight: 700, textDecoration: "none",
                    fontSize: "0.85rem", letterSpacing: "0.06em",
                  }}>
                    KREO
                  </Link>
                  <span style={{ color: "var(--muted)", fontWeight: 700 }}>/</span>
                  <span style={{ fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.06em" }}>PROJECTS</span>
                </div>
                <h1 style={{
                  fontSize: "clamp(2.8rem, 8vw, 7rem)",
                  fontWeight: 800, margin: 0, letterSpacing: "0.04em", lineHeight: 0.9,
                }}>
                  WORK
                </h1>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                <div style={{
                  background: "var(--yellow)", border: "3px solid var(--ink)",
                  boxShadow: "4px 4px 0 var(--ink)", padding: "0.3rem 0.8rem",
                  fontWeight: 800, fontSize: "1.1rem",
                }}>
                  {loading ? "—" : projects.length} Projects
                </div>
                <span style={{ fontWeight: 600, color: "var(--muted)", fontSize: "0.8rem" }}>
                  Plymouth, UK
                </span>
              </div>
            </div>

            {/* Filter pills */}
            {!loading && existingCats.length > 1 && (
              <div style={{
                display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "1.2rem",
                animation: "fadeIn 0.4s ease",
              }}>
                {existingCats.map((cat) => {
                  const isActive = activeFilter === cat;
                  const color = CAT_COLORS[cat] ?? "var(--ink)";
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      style={{
                        background: isActive ? (cat === "all" ? "var(--ink)" : color) : "#fff",
                        color: isActive ? (cat === "all" ? "#fff" : "#0D0D0D") : "var(--ink)",
                        border: "3px solid var(--ink)",
                        boxShadow: isActive ? "4px 4px 0 var(--ink)" : "2px 2px 0 var(--ink)",
                        fontWeight: 800, fontSize: "0.72rem",
                        padding: "0.3rem 0.8rem", letterSpacing: "0.1em",
                        textTransform: "uppercase", cursor: "none",
                        transition: "all 0.15s ease",
                        transform: isActive ? "translate(-1px,-1px)" : "translate(0,0)",
                      }}
                    >
                      {cat === "all" ? "ALL" : cat.replace("3d", "3D").replace("uiux", "UI/UX").toUpperCase()}
                      {cat !== "all" && (
                        <span style={{ marginLeft: "0.4rem", opacity: 0.6 }}>
                          ({projects.filter((p) => p.category?.toLowerCase() === cat).length})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="section" style={{ paddingTop: "1.5rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>

            {loading ? (
              <div style={{ padding: "4rem 0", textAlign: "center" }}>
                <div style={{
                  display: "inline-block",
                  border: "3px solid var(--ink)", boxShadow: "4px 4px 0 var(--ink)",
                  padding: "0.6rem 1.4rem", fontWeight: 700, color: "var(--muted)",
                }}>
                  Loading projects…
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "4rem 0", textAlign: "center" }}>
                <p style={{ fontWeight: 700, color: "var(--muted)" }}>No projects in this category yet.</p>
              </div>
            ) : (
              <>
                {/* Featured row */}
                {featured.length > 0 && (
                  <div style={{
                    display: "grid", gap: "1rem",
                    gridTemplateColumns: featured.length === 1 ? "1fr" : "1.4fr 1fr",
                    marginBottom: "1rem",
                  }}>
                    {featured.map((p, i) => (
                      <ProjectCard key={p._id} project={p} index={i} />
                    ))}
                  </div>
                )}

                {/* Regular grid */}
                {regular.length > 0 && (
                  <div style={{
                    display: "grid", gap: "1rem",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  }}>
                    {regular.map((p, i) => (
                      <ProjectCard key={p._id} project={p} index={featured.length + i} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Bottom nav */}
            <div style={{ marginTop: "2.5rem", borderTop: "3px solid var(--ink)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Link href="/" className="btn b-yellow tiny">← Back to KREO</Link>
              <Link href="#contact" className="btn b-black tiny">Get in Touch →</Link>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
