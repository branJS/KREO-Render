"use client";

import { useEffect, useState, useCallback } from "react";

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

export default function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() => setOpen((i) => (i !== null ? (i - 1 + images.length) % images.length : null)), [images.length]);
  const next = useCallback(() => setOpen((i) => (i !== null ? (i + 1) % images.length : null)), [images.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  return (
    <>
      {/* Grid */}
      <div style={{
        display: "grid",
        gap: "0.8rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      }}>
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setOpen(i)}
            style={{
              border: "3px solid var(--ink)",
              boxShadow: "6px 6px 0 var(--ink)",
              overflow: "hidden",
              cursor: "none",
              position: "relative",
              background: "#f0ebe2",
            }}
          >
            <img
              src={img.url}
              alt={img.alt || img.caption || `Gallery image ${i + 1}`}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.35s ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.05)")}
              onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
            />
            {/* Zoom icon */}
            <div style={{
              position: "absolute", bottom: "0.5rem", right: "0.5rem",
              background: "#0D0D0D", color: "#fff",
              border: "2px solid #fff",
              width: "28px", height: "28px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 800,
              boxShadow: "2px 2px 0 rgba(0,0,0,0.4)",
            }}>⤢</div>
            {img.caption && (
              <p style={{
                margin: 0, padding: "0.4rem 0.6rem",
                fontSize: "0.78rem", fontWeight: 600,
                color: "var(--muted)", borderTop: "2px solid var(--ink)",
                background: "#fff",
              }}>
                {img.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          onClick={close}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(13,13,13,0.95)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}
        >
          {/* Close */}
          <button
            onClick={close}
            style={{
              position: "fixed", top: "1.2rem", right: "1.2rem",
              background: "#fff", color: "#0D0D0D",
              border: "3px solid #0D0D0D", boxShadow: "4px 4px 0 #0D0D0D",
              width: "44px", height: "44px",
              fontWeight: 800, fontSize: "1.1rem",
              cursor: "pointer", zIndex: 1001,
            }}
          >✕</button>

          {/* Counter */}
          <div style={{
            position: "fixed", top: "1.2rem", left: "1.2rem",
            background: "#fff", color: "#0D0D0D",
            border: "3px solid #0D0D0D", boxShadow: "4px 4px 0 #0D0D0D",
            padding: "0.3rem 0.7rem", fontWeight: 800, fontSize: "0.85rem",
          }}>
            {open + 1} / {images.length}
          </div>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              style={{
                position: "fixed", left: "1.2rem", top: "50%", transform: "translateY(-50%)",
                background: "#fff", color: "#0D0D0D",
                border: "3px solid #0D0D0D", boxShadow: "4px 4px 0 #0D0D0D",
                width: "48px", height: "48px",
                fontWeight: 800, fontSize: "1.2rem",
                cursor: "pointer", zIndex: 1001,
              }}
            >←</button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              style={{
                position: "fixed", right: "1.2rem", top: "50%", transform: "translateY(-50%)",
                background: "#fff", color: "#0D0D0D",
                border: "3px solid #0D0D0D", boxShadow: "4px 4px 0 #0D0D0D",
                width: "48px", height: "48px",
                fontWeight: 800, fontSize: "1.2rem",
                cursor: "pointer", zIndex: 1001,
              }}
            >→</button>
          )}

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "90vw", maxHeight: "88vh", textAlign: "center" }}
          >
            <img
              src={images[open].url}
              alt={images[open].alt || `Gallery image ${open + 1}`}
              style={{
                maxWidth: "100%", maxHeight: "80vh",
                objectFit: "contain", display: "block",
                border: "3px solid #fff", boxShadow: "0 0 60px rgba(0,0,0,0.8)",
              }}
            />
            {images[open].caption && (
              <p style={{
                color: "#fff", fontWeight: 600, marginTop: "0.8rem",
                fontSize: "0.9rem", opacity: 0.8,
              }}>
                {images[open].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
