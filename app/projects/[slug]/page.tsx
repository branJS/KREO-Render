import Link from "next/link";
import type React from "react";
import { getProject, urlFor } from "@/lib/sanity.server";
import { isUniversityDesignPortfolio } from "@/lib/projectLock";
import { notFound } from "next/navigation";
import GalleryLightbox from "@/app/components/GalleryLightbox";

export const revalidate = 60;

const CAT_COLOR: Record<string, string> = {
  branding: "#F5C100",
  motion: "#00B6A3",
  "3d": "#1E6FE0",
  print: "#2DBA72",
  uiux: "#E56BE3",
  other: "#E24C3A",
};

function formatCategory(category?: string) {
  return category?.replace(/-/g, " ").replace("3d", "3D") || "Project";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildDeliverables(project: any, galleryCount: number) {
  const items = new Set<string>();
  const category = project.category?.toLowerCase() ?? "";

  if (category.includes("3d") || category.includes("render")) items.add("CGI stills");
  if (category.includes("motion")) items.add("Launch film");
  if (category.includes("branding")) items.add("Visual identity system");
  if (category.includes("print")) items.add("Investor print assets");
  if (project.videoUrl) items.add("Cinematic video asset");
  if (galleryCount > 0) items.add("Hero stills and image set");
  if (project.url) items.add("Digital launch destination");
  project.tags?.slice(0, 3).forEach((tag: string) => items.add(tag));

  return Array.from(items).slice(0, 6);
}

function DeckCard({
  num,
  title,
  children,
  accent,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <div style={{
      border: "3px solid var(--ink)",
      boxShadow: "6px 6px 0 var(--ink)",
      padding: "1.25rem",
      background: "var(--cream)",
      minHeight: "100%",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.75rem" }}>
        <span style={{ display: "inline-block", width: 10, height: 10, background: accent, border: "2px solid var(--ink)" }} />
        <span style={{
          fontFamily: "monospace",
          fontSize: "0.62rem",
          fontWeight: 900,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          opacity: 0.45,
        }}>{num}</span>
      </div>
      <h3 style={{
        margin: "0 0 0.75rem",
        fontSize: "clamp(1rem, 2vw, 1.25rem)",
        lineHeight: 1.15,
        fontWeight: 900,
        letterSpacing: "0.02em",
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProjectPage({ params }: { params: any }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const coverUrl = project.coverImage
    ? urlFor(project.coverImage).width(1600).height(800).url()
    : null;

  const catColor = CAT_COLOR[project.category?.toLowerCase()] ?? "#0D0D0D";
  const isLocked = isUniversityDesignPortfolio(project);

  if (isLocked) {
    return (
      <main style={{ paddingTop: "5rem", minHeight: "100vh" }}>
        <div className="section">
          <div className="panel" style={{
            maxWidth: 980,
            overflow: "hidden",
            background: "linear-gradient(135deg, var(--yellow) 0%, var(--cream) 42%, var(--teal) 100%)",
          }}>
            <Link href="/projects" className="btn b-yellow tiny">← All Projects</Link>
            <div style={{
              marginTop: "1.5rem",
              border: "3px solid var(--ink)",
              boxShadow: "10px 10px 0 var(--ink)",
              background: "rgba(242,236,227,0.88)",
              padding: "clamp(1.4rem, 4vw, 3rem)",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "repeating-linear-gradient(-45deg, rgba(13,13,13,0.08) 0 2px, transparent 2px 12px)",
                pointerEvents: "none",
              }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <span style={{
                  display: "inline-block",
                  background: "var(--ink)", color: "#fff",
                  border: "2px solid var(--ink)", boxShadow: "4px 4px 0 var(--yellow)",
                  fontWeight: 900, fontSize: "0.72rem",
                  padding: "0.4rem 0.7rem",
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  marginBottom: "1rem",
                }}>
                  Locked / Work in progress
                </span>
                <h1 style={{
                  margin: 0,
                  fontSize: "clamp(2.4rem, 8vw, 6.2rem)",
                  lineHeight: 0.9,
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                }}>
                  Portfolio<br />Under Wraps
                </h1>
                <p style={{
                  margin: "1.2rem 0 0",
                  maxWidth: 620,
                  color: "var(--muted)",
                  fontWeight: 700,
                  lineHeight: 1.7,
                  fontSize: "1rem",
                }}>
                  The university design portfolio is currently being refined, edited, and made properly presentable.
                  It will return once the work is ready to be seen at full strength.
                </p>
                <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                  <span className="btn b-black tiny">Access paused</span>
                  <span className="btn b-teal tiny">Coming soon</span>
                  <span className="btn outline tiny">KREO WIP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Build gallery image list
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const galleryImages = (project.gallery ?? []).map((item: any) => ({
    url: item.url ?? (item.asset ? urlFor(item).width(1600).url() : null),
    alt: item.alt ?? item.caption ?? project.title,
    caption: item.caption ?? null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })).filter((img: any) => img.url);
  const deliverables = buildDeliverables(project, galleryImages.length);
  const launchAssets = [
    coverUrl ? "Hero still" : null,
    project.videoUrl ? "Cinematic film embed" : null,
    galleryImages.length ? `${galleryImages.length} gallery assets` : null,
    project.url ? "Live launch link" : null,
  ].filter(Boolean);
  const challengeText = project.brief || project.description || "Create a visual story that makes the property feel credible, desirable, and ready for a commercial audience.";
  const strategyText = project.process || "Build the property around atmosphere, clarity, and sequence: hero imagery first, then supporting visuals that help buyers, tenants, or investors understand the opportunity quickly.";
  const outcomeText = project.outcome || "Designed to increase confidence before the viewing, pitch, or launch moment by giving the property a sharper first impression.";

  return (
    <main style={{ paddingTop: "5rem", minHeight: "100vh" }}>

      {/* ── Hero cover ── */}
      {coverUrl && (
        <div style={{
          position: "relative",
          width: "100%",
          height: "clamp(320px, 55vh, 620px)",
          overflow: "hidden",
        }}>
          <img
            src={coverUrl}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Bottom fade */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, transparent 40%, rgba(13,13,13,0.75) 100%)",
          }} />
          {/* Title overlay on hero */}
          <div style={{
            position: "absolute", bottom: "2.5rem", left: "2rem", right: "2rem",
          }}>
            <div style={{
              display: "flex",
              gap: "0.55rem",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: "0.7rem",
            }}>
              <span style={{
                display: "inline-block",
                background: "var(--ink)", color: "#fff",
                border: "2px solid #fff", fontWeight: 900,
                fontSize: "0.68rem", padding: "4px 10px",
                letterSpacing: "0.14em", textTransform: "uppercase",
              }}>
                Private deck
              </span>
              <span style={{
                display: "inline-block",
                background: catColor, color: "#0D0D0D",
                border: "2px solid #fff", fontWeight: 900,
                fontSize: "0.68rem", padding: "4px 10px",
                letterSpacing: "0.14em", textTransform: "uppercase",
              }}>
                {formatCategory(project.category)}
              </span>
            </div>
            <div style={{
              color: "rgba(255,255,255,0.78)",
              fontWeight: 800,
              fontSize: "0.78rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: "0.45rem",
            }}>
              Built for investor, buyer, or tenant attention
            </div>
            <h1 style={{
              color: "#fff", margin: 0,
              fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
              fontWeight: 800, letterSpacing: "0.03em", lineHeight: 1.1,
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}>
              {project.title}
            </h1>
          </div>
        </div>
      )}

      <div className="section" style={{ paddingTop: "1.5rem" }}>
        <div className="panel" style={{ maxWidth: 1100 }}>

          {/* Back nav */}
          <div style={{ marginBottom: "1.5rem" }}>
            <Link href="/projects" className="btn b-yellow tiny">← All Projects</Link>
          </div>

          {/* If no cover, show title here */}
          {!coverUrl && (
            <h1 style={{
              fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 800,
              margin: "0 0 1rem", letterSpacing: "0.03em",
            }}>
              {project.title}
            </h1>
          )}

          {/* Tags row */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.2rem" }}>
            {project.category && (
              <span style={{
                background: catColor, color: "#0D0D0D",
                border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)",
                fontWeight: 800, fontSize: "0.72rem", padding: "3px 10px",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                {formatCategory(project.category)}
              </span>
            )}
            {project.tags?.map((tag: string) => (
              <span key={tag} className="btn tiny outline" style={{
                fontSize: "0.72rem", padding: "3px 10px", boxShadow: "3px 3px 0 var(--ink)",
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Investor deck structure */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "1rem",
              flexWrap: "wrap",
              borderBottom: "3px solid var(--ink)",
              paddingBottom: "0.9rem",
              marginBottom: "1rem",
            }}>
              <div>
                <span style={{
                  display: "block",
                  fontFamily: "monospace",
                  fontSize: "0.66rem",
                  fontWeight: 900,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  opacity: 0.45,
                  marginBottom: "0.3rem",
                }}>
                  Case study deck
                </span>
                <h2 className="section-title" style={{ margin: 0 }}>
                  Property Launch Narrative
                </h2>
              </div>
              <span className="btn b-black tiny" style={{ fontSize: "0.72rem" }}>
                Built for attention
              </span>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
              gap: "1rem",
            }}>
              <DeckCard num="01" title="Hero Still" accent={catColor}>
                <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", fontWeight: 650 }}>
                  The lead image sets the commercial first impression: atmosphere, credibility, and a clear sense of place before the viewer reads a word.
                </p>
              </DeckCard>

              <DeckCard num="02" title="Challenge" accent="var(--yellow)">
                <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", fontWeight: 650 }}>
                  {challengeText}
                </p>
              </DeckCard>

              <DeckCard num="03" title="Visual Strategy" accent="var(--teal)">
                <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", fontWeight: 650 }}>
                  {strategyText}
                </p>
              </DeckCard>

              <DeckCard num="04" title="Deliverables" accent="var(--green)">
                <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                  {(deliverables.length ? deliverables : ["Hero stills", "Visual direction", "Launch-ready story"]).map((item) => (
                    <span key={item} className="btn tiny outline" style={{
                      fontSize: "0.7rem",
                      padding: "0.28rem 0.55rem",
                      boxShadow: "3px 3px 0 var(--ink)",
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </DeckCard>

              <DeckCard num="05" title="Launch Assets" accent="var(--blue)">
                <ul style={{
                  margin: 0,
                  paddingLeft: "1.05rem",
                  color: "var(--muted)",
                  fontSize: "0.9rem",
                  lineHeight: 1.8,
                  fontWeight: 650,
                }}>
                  {(launchAssets.length ? launchAssets : ["Investor-facing case study", "Marketing-ready project story", "Contact pathway for launch enquiries"]).map((asset) => (
                    <li key={String(asset)}>{asset}</li>
                  ))}
                </ul>
              </DeckCard>

              <DeckCard num="06" title="Outcome / Intended Impact" accent="var(--pink)">
                <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", fontWeight: 650 }}>
                  {outcomeText}
                </p>
              </DeckCard>
            </div>
          </div>

          {/* Description + CTA row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: project.url ? "1fr auto" : "1fr",
            gap: "1.5rem", alignItems: "flex-start",
            marginBottom: "2rem",
            borderBottom: "3px solid var(--ink)", paddingBottom: "1.5rem",
          }}>
            {project.description && (
              <p style={{
                fontWeight: 600, color: "var(--muted)", lineHeight: 1.75,
                margin: 0, fontSize: "1rem", maxWidth: "680px",
              }}>
                {project.description}
              </p>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn b-teal"
                style={{ whiteSpace: "nowrap" }}
              >
                View Live ↗
              </a>
            )}
          </div>

          <div style={{
            marginBottom: "2rem",
            background: "var(--ink)",
            color: "#fff",
            border: "3px solid var(--ink)",
            boxShadow: "8px 8px 0 var(--yellow)",
            padding: "1.1rem 1.25rem",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
          }}>
            <p style={{
              margin: 0,
              fontSize: "clamp(1rem, 2.4vw, 1.35rem)",
              lineHeight: 1.35,
              fontWeight: 900,
            }}>
              Built for investor, buyer, or tenant attention.
            </p>
            <span style={{
              background: "var(--yellow)",
              color: "var(--ink)",
              border: "2px solid #fff",
              boxShadow: "4px 4px 0 rgba(255,255,255,0.25)",
              fontSize: "0.7rem",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.45rem 0.65rem",
              whiteSpace: "nowrap",
            }}>
              KREO property deck
            </span>
          </div>

          {/* Video embed */}
          {project.videoUrl && (
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{
                fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.12em",
                textTransform: "uppercase", marginBottom: "0.8rem",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <span style={{
                  display: "inline-block", width: "10px", height: "10px",
                  background: "var(--red)", border: "2px solid var(--ink)",
                }} />
                Video
              </h2>
              <iframe
                src={project.videoUrl}
                style={{
                  width: "100%", aspectRatio: "16/9",
                  border: "3px solid var(--ink)", boxShadow: "8px 8px 0 var(--ink)",
                  display: "block",
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Gallery with lightbox */}
          {galleryImages.length > 0 && (
            <div>
              <h2 style={{
                fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.12em",
                textTransform: "uppercase", marginBottom: "1rem",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <span style={{
                  display: "inline-block", width: "10px", height: "10px",
                  background: catColor, border: "2px solid var(--ink)",
                }} />
                Gallery — click to expand
              </h2>
              <GalleryLightbox images={galleryImages} />
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
