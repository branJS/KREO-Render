import Link from "next/link";
import { getProject, urlFor } from "@/lib/sanity.server";
import { notFound } from "next/navigation";

export const revalidate = 60;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProjectPage({ params }: { params: any }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const coverUrl = project.coverImage
    ? urlFor(project.coverImage).width(1200).height(700).url()
    : null;

  return (
    <main className="section" style={{ paddingTop: "6rem" }}>
      <div className="panel">
        <div style={{ marginBottom: "1.2rem" }}>
          <Link href="/projects" className="btn b-yellow tiny">← All Projects</Link>
        </div>

        {/* Cover image */}
        {coverUrl && (
          <div
            style={{
              width: "100%",
              height: "420px",
              overflow: "hidden",
              border: "3px solid var(--ink)",
              boxShadow: "8px 8px 0 var(--ink)",
              marginBottom: "1.5rem",
            }}
          >
            <img
              src={coverUrl}
              alt={project.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Title + meta */}
        <h1
          style={{
            fontSize: "clamp(1.6rem, 5vw, 3rem)",
            fontWeight: 800,
            margin: "0 0 0.4rem",
            letterSpacing: "0.02em",
          }}
        >
          {project.title}
        </h1>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {project.category && (
            <span
              className="btn tiny b-yellow"
              style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", boxShadow: "3px 3px 0 var(--ink)" }}
            >
              {project.category.replace(/-/g, " ").replace("3d", "3D")}
            </span>
          )}
          {project.tags?.map((tag: string) => (
            <span
              key={tag}
              className="btn tiny outline"
              style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", boxShadow: "3px 3px 0 var(--ink)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        {project.description && (
          <p
            style={{
              fontWeight: 600,
              color: "var(--muted)",
              maxWidth: "680px",
              lineHeight: 1.6,
              marginBottom: "1.5rem",
            }}
          >
            {project.description}
          </p>
        )}

        {/* Live project link */}
        {project.url && (
          <div style={{ marginBottom: "1.5rem" }}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn b-teal"
            >
              View Live Project ↗
            </a>
          </div>
        )}

        {/* Video embed */}
        {project.videoUrl && (
          <div style={{ marginBottom: "1.5rem" }}>
            <iframe
              src={project.videoUrl}
              style={{
                width: "100%",
                aspectRatio: "16/9",
                border: "3px solid var(--ink)",
                boxShadow: "6px 6px 0 var(--ink)",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                marginBottom: "0.8rem",
                borderBottom: "3px solid var(--ink)",
                paddingBottom: "0.4rem",
              }}
            >
              Gallery
            </h2>
            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {project.gallery.map((item: any, i: number) => {
                const imgUrl = item.url
                  ? item.url
                  : item.asset
                  ? urlFor(item).width(800).url()
                  : null;
                if (!imgUrl) return null;
                return (
                  <div
                    key={i}
                    style={{
                      border: "3px solid var(--ink)",
                      boxShadow: "6px 6px 0 var(--ink)",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={item.alt || item.caption || project.title}
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                    {item.caption && (
                      <p
                        style={{
                          margin: 0,
                          padding: "0.5rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--muted)",
                          borderTop: "2px solid var(--ink)",
                        }}
                      >
                        {item.caption}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
