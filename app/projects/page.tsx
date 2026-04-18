import Link from "next/link";
import { getProjects, urlFor } from "@/lib/sanity.server";

const CATEGORY_COLORS: Record<string, string> = {
  branding: "b-yellow",
  motion: "b-teal",
  print: "b-pink",
  digital: "b-blue",
  "ui-ux": "b-green",
  "3d-render": "b-red",
  other: "b-black",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="section" style={{ paddingTop: "6rem" }}>
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Projects</h2>
          <Link href="/" className="btn b-yellow tiny">← Home</Link>
        </div>

        {projects.length === 0 ? (
          <div style={{ padding: "2rem 0", textAlign: "center", color: "var(--muted)" }}>
            <p style={{ fontWeight: 600 }}>No projects published yet.</p>
            <p style={{ fontSize: "0.9rem" }}>
              Add projects via{" "}
              <Link href="/studio" style={{ color: "var(--ink)", fontWeight: 700 }}>
                /studio
              </Link>
            </p>
          </div>
        ) : (
          <div
            className="grid"
            style={{ marginTop: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
          >
            {projects.map((project: any) => {
              const coverUrl = project.coverImage
                ? urlFor(project.coverImage).width(600).height(400).url()
                : null;
              const colorClass = CATEGORY_COLORS[project.category] ?? "b-black";

              return (
                <Link
                  key={project._id}
                  href={`/projects/${project.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="card"
                    style={{
                      padding: 0,
                      overflow: "hidden",
                    }}
                  >
                    {/* Cover image */}
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        background: "#f0ebe2",
                        overflow: "hidden",
                        borderBottom: "3px solid var(--ink)",
                      }}
                    >
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={project.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--muted)",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                          }}
                        >
                          No image
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div style={{ padding: "0.9rem" }}>
                      {project.category && (
                        <span
                          className={`btn tiny ${colorClass}`}
                          style={{
                            fontSize: "0.7rem",
                            padding: "0.2rem 0.5rem",
                            display: "inline-block",
                            marginBottom: "0.4rem",
                            boxShadow: "3px 3px 0 var(--ink)",
                          }}
                        >
                          {project.category.replace("-", " ").replace("3d", "3D")}
                        </span>
                      )}
                      <h3 style={{ margin: "0.2rem 0 0.3rem", fontSize: "1rem", fontWeight: 800 }}>
                        {project.title}
                      </h3>
                      {project.description && (
                        <p
                          style={{
                            color: "var(--muted)",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            margin: 0,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
