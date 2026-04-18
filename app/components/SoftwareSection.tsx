"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const builder = imageUrlBuilder(client as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) { return builder.image(source); }

const QUERY = groq`*[_type == "software"] | order(featured desc, order asc) {
  _id, title, description, image, techStack, status, githubUrl, demoUrl, featured
}`;

const STATUS_STYLE: Record<string, { bg: string; label: string }> = {
  released:        { bg: "#2DBA72", label: "✓ RELEASED" },
  "in-development":{ bg: "#F5C100", label: "⚡ IN DEV" },
  "open-source":   { bg: "#1E6FE0", label: "◎ OPEN SOURCE" },
  archived:        { bg: "#6F6F6F", label: "▣ ARCHIVED" },
};

const LANG_COLORS: Record<string, string> = {
  python: "#3776AB", javascript: "#F7DF1E", typescript: "#3178C6",
  react: "#61DAFB", node: "#339933", rust: "#CE422B", go: "#00ADD8",
  swift: "#FA7343", kotlin: "#7F52FF", css: "#264DE4", html: "#E34F26",
  "c++": "#00599C", c: "#A8B9CC", java: "#007396", php: "#777BB4",
  ruby: "#CC342D", flutter: "#02569B", unity: "#222222", blender: "#EA7600",
};

const PLACEHOLDERS = [
  {
    _id: "ph0", title: "Coming Soon", featured: true, status: "in-development",
    description: "Our first software release is currently in development. Check back soon.",
    techStack: ["TypeScript", "React", "Node"],
    image: null, githubUrl: null, demoUrl: null,
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SoftwareCard({ item }: { item: any }) {
  const [hovered, setHovered] = useState(false);
  const imgUrl = item.image ? urlFor(item.image).width(800).height(450).url() : null;
  const status = STATUS_STYLE[item.status] ?? { bg: "#6F6F6F", label: item.status?.toUpperCase() ?? "PROJECT" };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: "3px solid var(--ink)",
        boxShadow: hovered ? "10px 10px 0 var(--ink)" : "6px 6px 0 var(--ink)",
        transform: hovered ? "translate(-2px,-2px)" : "translate(0,0)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Screenshot */}
      <div style={{
        width: "100%", height: "180px",
        background: "linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 100%)",
        overflow: "hidden", position: "relative",
        borderBottom: "3px solid var(--ink)",
      }}>
        {imgUrl ? (
          <img
            src={imgUrl} alt={item.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
          />
        ) : (
          /* Code-pattern placeholder */
          <div style={{ padding: "1rem", fontFamily: "monospace", fontSize: "0.7rem", color: "#00ff88", opacity: 0.5, lineHeight: 1.6 }}>
            {"// KREO Software\n"}
            {"function build() {\n"}
            {"  return {\n"}
            {"    quality: 'max',\n"}
            {"    shipping: true,\n"}
            {"  };\n"}
            {"}\n"}
          </div>
        )}
        {/* Status badge */}
        <div style={{
          position: "absolute", top: "0.7rem", left: "0.7rem",
          background: status.bg, color: "#0D0D0D",
          border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)",
          fontWeight: 800, fontSize: "0.58rem", padding: "2px 8px",
          letterSpacing: "0.12em",
        }}>
          {status.label}
        </div>
        {item.featured && (
          <div style={{
            position: "absolute", top: "0.7rem", right: "0.7rem",
            background: "#F5C100", color: "#0D0D0D",
            border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)",
            fontWeight: 800, fontSize: "0.58rem", padding: "2px 8px",
          }}>
            ★ FEATURED
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "1rem" }}>
        <h3 style={{ margin: "0 0 0.4rem", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.02em" }}>
          {item.title}
        </h3>

        {item.description && (
          <p style={{
            color: "var(--muted)", fontWeight: 600, fontSize: "0.83rem",
            margin: "0 0 0.8rem", lineHeight: 1.55,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {item.description}
          </p>
        )}

        {/* Tech stack pills */}
        {item.techStack && item.techStack.length > 0 && (
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
            {item.techStack.map((tech: string) => {
              const color = LANG_COLORS[tech.toLowerCase()] ?? "#0D0D0D";
              return (
                <span key={tech} style={{
                  display: "flex", alignItems: "center", gap: "0.3rem",
                  background: "#f4f4f4", border: "2px solid var(--ink)",
                  fontWeight: 700, fontSize: "0.68rem", padding: "2px 7px",
                  letterSpacing: "0.05em",
                }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                  {tech}
                </span>
              );
            })}
          </div>
        )}

        {/* Links */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {item.githubUrl && (
            <a
              href={item.githubUrl}
              target="_blank" rel="noopener noreferrer"
              className="btn tiny b-black"
              style={{ fontSize: "0.72rem", boxShadow: "3px 3px 0 var(--ink)" }}
            >
              GitHub ↗
            </a>
          )}
          {item.demoUrl && (
            <a
              href={item.demoUrl}
              target="_blank" rel="noopener noreferrer"
              className="btn tiny b-teal"
              style={{ fontSize: "0.72rem", boxShadow: "3px 3px 0 var(--ink)" }}
            >
              Live Demo ↗
            </a>
          )}
          {!item.githubUrl && !item.demoUrl && (
            <span className="btn tiny outline" style={{ fontSize: "0.72rem", boxShadow: "3px 3px 0 var(--ink)", color: "var(--muted)" }}>
              Coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SoftwareSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(QUERY)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => { setItems(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const display = items.length > 0 ? items : PLACEHOLDERS;
  const isEmpty = items.length === 0 && !loading;

  return (
    <section id="software" className="section">
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Software Portfolio</h2>
          <span className="btn b-black tiny" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)", fontFamily: "monospace" }}>
            {"</>"}
          </span>
        </div>

        {isEmpty && (
          <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: "0.85rem", margin: "0 0 0.8rem" }}>
            Add software projects via Studio → Software Portfolio
          </p>
        )}

        {loading ? (
          <p style={{ color: "var(--muted)", fontWeight: 600 }}>Loading…</p>
        ) : (
          <div style={{
            display: "grid", gap: "1rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            marginTop: "0.8rem",
            opacity: isEmpty ? 0.5 : 1,
          }}>
            {display.map((item) => (
              <SoftwareCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
