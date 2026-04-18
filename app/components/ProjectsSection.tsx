"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const builder = imageUrlBuilder(client as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) { return builder.image(source); }

const QUERY = groq`*[_type == "project" && !(_id in path("drafts.**"))] | order(featured desc, order asc, publishedAt desc) {
  _id, title, "slug": slug.current, category, description, coverImage, featured
}`;

const CAT_COLOR: Record<string, string> = {
  branding: "#F5C100",
  motion: "#00B6A3",
  "3d": "#1E6FE0",
  print: "#2DBA72",
  uiux: "#E56BE3",
  other: "#E24C3A",
};

const PLACEHOLDERS = [
  { _id: "ph0", title: "Brand Identity", slug: "#", category: "branding", description: "Add real projects via Studio → Projects", coverImage: null, featured: true },
  { _id: "ph1", title: "Motion Reel", slug: "#", category: "motion", description: "Showcase your motion work here.", coverImage: null, featured: false },
  { _id: "ph2", title: "3D Render", slug: "#", category: "3d", description: "Your 3D portfolio pieces.", coverImage: null, featured: false },
  { _id: "ph3", title: "Print Design", slug: "#", category: "print", description: "Print and editorial work.", coverImage: null, featured: false },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProjectCard({ project, size = "normal" }: { project: any; size?: "hero" | "wide" | "normal" }) {
  const [hovered, setHovered] = useState(false);
  const isHero = size === "hero";
  const isWide = size === "wide";

  const coverUrl = project.coverImage
    ? urlFor(project.coverImage)
        .width(isHero ? 1400 : isWide ? 800 : 600)
        .height(isHero ? 700 : isWide ? 500 : 400)
        .url()
    : null;

  const catColor = CAT_COLOR[project.category?.toLowerCase()] ?? "#0D0D0D";
  const height = isHero ? "440px" : isWide ? "300px" : "240px";
  const href = project.slug === "#" ? "#" : `/projects/${project.slug}`;

  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "block", height }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          height: "100%",
          overflow: "hidden",
          border: "3px solid var(--ink)",
          boxShadow: hovered ? "12px 12px 0 var(--ink)" : "6px 6px 0 var(--ink)",
          transform: hovered ? "translate(-3px,-3px)" : "translate(0,0)",
          transition: "transform 0.22s ease, box-shadow 0.22s ease",
          cursor: "none",
          background: "#fff",
        }}
      >
        {/* Image / placeholder bg */}
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={project.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hovered ? "scale(1.07)" : "scale(1)",
              transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: `linear-gradient(135deg, ${catColor}22 0%, ${catColor}55 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontSize: isHero ? "5rem" : "3rem", fontWeight: 800,
              color: catColor, opacity: 0.4, letterSpacing: "0.05em",
            }}>
              {project.title?.[0] ?? "K"}
            </span>
          </div>
        )}

        {/* Scrim — always present, intensifies on hover */}
        <div style={{
          position: "absolute", inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.45) 60%, transparent 100%)"
            : "linear-gradient(to top, rgba(13,13,13,0.55) 0%, transparent 60%)",
          transition: "background 0.3s ease",
        }} />

        {/* Bottom content — always visible */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: isHero ? "1.8rem 2rem" : "1rem 1.2rem",
          transform: hovered ? "translateY(0)" : "translateY(0)",
        }}>
          <div style={{
            display: "inline-block",
            background: catColor, color: "#0D0D0D", fontWeight: 800,
            fontSize: "0.62rem", padding: "3px 8px",
            border: "2px solid rgba(255,255,255,0.6)",
            letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}>
            {project.category || "Project"}
          </div>

          <h3 style={{
            color: "#fff", margin: 0, lineHeight: 1.15,
            fontSize: isHero ? "1.9rem" : isWide ? "1.2rem" : "1rem",
            fontWeight: 800, letterSpacing: "0.04em",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}>
            {project.title}
          </h3>

          {/* Description — slides in on hover */}
          <div style={{
            overflow: "hidden",
            maxHeight: hovered ? "80px" : "0px",
            opacity: hovered ? 1 : 0,
            transition: "max-height 0.3s ease, opacity 0.25s ease",
            marginTop: hovered ? "0.5rem" : 0,
          }}>
            {project.description && (
              <p style={{
                color: "rgba(255,255,255,0.75)", fontWeight: 600,
                fontSize: "0.85rem", margin: "0 0 0.8rem", lineHeight: 1.5,
              }}>
                {project.description}
              </p>
            )}
            <span style={{
              display: "inline-block",
              background: "#fff", color: "#0D0D0D", fontWeight: 800,
              fontSize: "0.78rem", padding: "0.35rem 0.8rem",
              border: "2px solid #fff", letterSpacing: "0.08em",
            }}>
              VIEW PROJECT →
            </span>
          </div>
        </div>

        {/* Featured star */}
        {project.featured && (
          <div style={{
            position: "absolute", top: "0.8rem", right: "0.8rem",
            background: "#F5C100", color: "#0D0D0D",
            border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)",
            fontSize: "0.62rem", fontWeight: 800, padding: "3px 8px",
            letterSpacing: "0.1em",
          }}>
            ★ FEATURED
          </div>
        )}
      </div>
    </Link>
  );
}

export default function ProjectsSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(QUERY)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => { setProjects(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const display = projects.length > 0 ? projects : PLACEHOLDERS;
  const [hero, ...rest] = display;

  // Split rest into left column (wide) and right column (normals)
  const wide = rest.slice(0, 1);
  const normals = rest.slice(1);

  return (
    <section id="projects" className="section">
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Projects</h2>
          <Link href="/projects" className="btn b-yellow tiny">View All →</Link>
        </div>

        {loading ? (
          <p style={{ color: "var(--muted)", fontWeight: 600, padding: "1rem 0" }}>Loading…</p>
        ) : (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>

            {/* Row 1: Hero + stacked wides */}
            <div style={{ display: "grid", gridTemplateColumns: wide.length ? "1.5fr 1fr" : "1fr", gap: "0.8rem" }}>
              {hero && <ProjectCard project={hero} size="hero" />}
              {wide.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {wide.map((p) => (
                    <ProjectCard key={p._id} project={p} size="wide" />
                  ))}
                </div>
              )}
            </div>

            {/* Row 2: normal grid */}
            {normals.length > 0 && (
              <div style={{
                display: "grid", gap: "0.8rem",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              }}>
                {normals.map((p) => (
                  <ProjectCard key={p._id} project={p} size="normal" />
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}
