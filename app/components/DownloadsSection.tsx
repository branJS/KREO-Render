"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

const QUERY = groq`*[_type == "download"] | order(order asc) {
  _id, title, description, category, free,
  "fileUrl": file.asset->url,
  "fileName": file.asset->originalFilename,
  "fileSize": file.asset->size
}`;

const CATEGORY_LABELS: Record<string, string> = {
  "brand-pack": "Brand Pack",
  "press-kit": "Press Kit",
  "case-pdf": "Case PDF",
  "template": "Template",
  "resource": "Resource",
  "other": "Other",
};

const CATEGORY_COLORS: Record<string, string> = {
  "brand-pack": "b-yellow",
  "press-kit": "b-blue",
  "case-pdf": "b-teal",
  "template": "b-green",
  "resource": "b-pink",
  "other": "b-black",
};

function formatBytes(bytes: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DownloadsSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(QUERY)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => { setFiles(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="downloads" className="section">
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Downloads</h2>
          <span
            className="btn b-green tiny"
            style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}
          >
            Free Resources
          </span>
        </div>

        <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: "0.9rem", margin: "0.4rem 0 1rem" }}>
          Free content will randomly spawn here — keep watch.
        </p>

        {loading ? (
          <p style={{ color: "var(--muted)", fontWeight: 600 }}>Loading files…</p>
        ) : files.length === 0 ? (
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {["Brand Pack", "Press Kit", "Case PDFs"].map((label) => (
              <div
                key={label}
                className="list-item"
                style={{ opacity: 0.45 }}
              >
                <div className="bullet" />
                <div className="li-body">
                  <h3 style={{ margin: 0 }}>{label}</h3>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
                    Upload files via Studio → Downloads
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {files.map((file) => {
              const colorClass = CATEGORY_COLORS[file.category] ?? "b-black";
              const catLabel = CATEGORY_LABELS[file.category] ?? "File";
              const size = formatBytes(file.fileSize);
              return (
                <div key={file._id} className="list-item">
                  <div className="bullet" style={{ background: "var(--teal)" }} />
                  <div className="li-body" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <h3 style={{ margin: "0 0 0.1rem", fontSize: "0.95rem" }}>{file.title}</h3>
                      {file.description && (
                        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600 }}>
                          {file.description}
                        </p>
                      )}
                      <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.3rem", alignItems: "center" }}>
                        <span
                          className={`btn tiny ${colorClass}`}
                          style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem", boxShadow: "2px 2px 0 var(--ink)" }}
                        >
                          {catLabel}
                        </span>
                        {size && (
                          <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600 }}>{size}</span>
                        )}
                        {file.free && (
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--green)" }}>FREE</span>
                        )}
                      </div>
                    </div>
                    {file.fileUrl ? (
                      <a
                        href={file.fileUrl}
                        download={file.fileName || file.title}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn b-teal tiny"
                        style={{ boxShadow: "3px 3px 0 var(--ink)", whiteSpace: "nowrap" }}
                      >
                        ↓ Download
                      </a>
                    ) : (
                      <span
                        className="btn tiny outline"
                        style={{ opacity: 0.5, boxShadow: "3px 3px 0 var(--ink)" }}
                      >
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
