import Link from "next/link";
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
              display: "inline-block",
              background: catColor, color: "#0D0D0D",
              border: "2px solid #fff", fontWeight: 800,
              fontSize: "0.7rem", padding: "3px 10px",
              letterSpacing: "0.12em", textTransform: "uppercase",
              marginBottom: "0.6rem",
            }}>
              {project.category?.replace(/-/g, " ").replace("3d", "3D") || "Project"}
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
                {project.category.replace(/-/g, " ").replace("3d", "3D")}
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

          {/* Project Story: Brief / Process / Outcome */}
          {(project.brief || project.process || project.outcome) && (
            <div style={{ marginBottom: "2.5rem" }}>
              <h2 style={{
                fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.15em",
                textTransform: "uppercase", marginBottom: "1rem",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <span style={{ display: "inline-block", width: 10, height: 10, background: catColor, border: "2px solid var(--ink)" }} />
                Project Story
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1rem",
              }}>
                {[
                  { num: "01", label: "The Brief",   text: project.brief,   color: "var(--yellow)" },
                  { num: "02", label: "The Process",  text: project.process, color: "var(--teal)" },
                  { num: "03", label: "The Outcome",  text: project.outcome, color: "var(--green)" },
                ].map(({ num, label, text, color }) => text ? (
                  <div key={num} style={{
                    border: "3px solid var(--ink)",
                    boxShadow: "5px 5px 0 var(--ink)",
                    padding: "1.2rem",
                    background: "var(--cream)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                      <span style={{
                        display: "inline-block", width: 8, height: 8,
                        background: color, border: "2px solid var(--ink)",
                        flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: "monospace", fontSize: "0.6rem",
                        fontWeight: 800, letterSpacing: "0.14em",
                        textTransform: "uppercase", opacity: 0.45,
                      }}>{num}</span>
                      <span style={{
                        fontSize: "0.78rem", fontWeight: 800,
                        letterSpacing: "0.06em", textTransform: "uppercase",
                      }}>{label}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)" }}>
                      {text}
                    </p>
                  </div>
                ) : null)}
              </div>
            </div>
          )}

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
