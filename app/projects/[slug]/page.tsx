import Link from "next/link";
import { getProject, urlFor } from "@/lib/sanity.server";
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
