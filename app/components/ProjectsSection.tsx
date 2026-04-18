"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const builder = imageUrlBuilder(client as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) {
  return builder.image(source);
}

const QUERY = groq`*[_type == "project" && !(_id in path("drafts.**"))] | order(order asc, publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  description,
  coverImage,
  featured
}`;

export default function ProjectsSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(QUERY)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => {
        setProjects(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="section">
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Projects</h2>
          <Link href="/projects" className="btn b-yellow tiny">View All →</Link>
        </div>

        {loading ? (
          <p style={{ color: "var(--muted)", fontWeight: 600, padding: "1rem 0" }}>
            Loading projects…
          </p>
        ) : projects.length === 0 ? (
          <p style={{ color: "var(--muted)", fontWeight: 600, padding: "1rem 0" }}>
            No projects published yet.
          </p>
        ) : (
          <div
            className="grid"
            style={{ marginTop: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
          >
            {projects.map((project) => {
              const coverUrl = project.coverImage
                ? urlFor(project.coverImage).width(500).height(350).url()
                : null;

              return (
                <Link
                  key={project._id}
                  href={`/projects/${project.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    {/* Cover image */}
                    <div
                      style={{
                        width: "100%",
                        height: "180px",
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

                    {/* Card text */}
                    <div style={{ padding: "0.8rem" }}>
                      <h3 style={{ margin: "0 0 0.3rem", fontSize: "1rem", fontWeight: 800 }}>
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
    </section>
  );
}
