"use client";

import { useState } from "react";

const GOOGLE_URL = "https://www.google.com/search?q=Brandon+Lee+Graphic+Design&kgmid=/g/11wpl1nkn1";

const REVIEWS = [
  {
    _id: "r1",
    name: "lilohs",
    date: "41 weeks ago",
    quote: "Awesome guy to work with and insanely talented. Recommend 200%",
    rating: 5,
  },
  {
    _id: "r2",
    name: "Dylan Polchies",
    date: "42 weeks ago",
    quote: "Highly recommended always delivering quality work!",
    rating: 5,
  },
  {
    _id: "r3",
    name: "jay osoria",
    date: "42 weeks ago",
    quote: "Very very professional graphic work, and extremely reliable with time. Good pricing! Highly recommend!!",
    rating: 5,
  },
  {
    _id: "r4",
    name: "Jaze LTD",
    date: "Oct 2024",
    quote: "Worked with them frequently for a variety of design services, top class!",
    rating: 5,
  },
  {
    _id: "r5",
    name: "Mustafa Aijaz",
    date: "Oct 2024",
    quote: "Very reliable designer. Capable of any style and needs as per my request. Highly recommend!",
    rating: 5,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "0.5rem" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= rating ? "var(--yellow)" : "#ddd", fontSize: "1.8rem" }}>★</span>
      ))}
    </div>
  );
}

// Google 'G' logo as inline SVG
function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ display: "block", flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

export default function ReviewsSection() {
  const [paused, setPaused] = useState(false);

  // Duplicate track for seamless infinite scroll
  const track = [...REVIEWS, ...REVIEWS];

  return (
    <section id="reviews" className="section">
      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.9rem 1.2rem",
          borderBottom: "3px solid var(--ink)",
        }}>
          <h2 className="section-title" style={{ margin: 0 }}>Reviews</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", opacity: 0.55 }}>
              <GoogleG />
              <span style={{ fontWeight: 700, fontSize: "0.72rem" }}>Google</span>
            </div>
            <a
              href={GOOGLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn b-yellow tiny"
              style={{ fontSize: "0.68rem", boxShadow: "3px 3px 0 var(--ink)", textDecoration: "none" }}
            >
              ★ 5.0 · {REVIEWS.length} Reviews
            </a>
          </div>
        </div>

        {/* Conveyor belt */}
        <div
          style={{ overflow: "hidden", padding: "1.2rem 0" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div style={{
            display: "flex",
            width: "max-content",
            gap: "1rem",
            padding: "0 1rem",
            animation: `kreo-marquee 48s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
          }}>
            {track.map((review, i) => (
              <a
                key={`${review._id}-${i}`}
                href={GOOGLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "320px",
                  flexShrink: 0,
                  background: "#fff",
                  border: "3px solid var(--ink)",
                  boxShadow: "6px 6px 0 var(--ink)",
                  padding: "1.1rem",
                  borderTop: "6px solid var(--yellow)",
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(-2px,-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "8px 8px 0 var(--ink)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "none";
                  (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 var(--ink)";
                }}
              >
                {/* Google logo + stars row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <Stars rating={review.rating || 5} />
                  <GoogleG />
                </div>

                <p style={{
                  fontWeight: 600, lineHeight: 1.6, margin: "0 0 0.9rem",
                  fontSize: "0.88rem", fontStyle: "italic",
                  color: "var(--ink)",
                }}>
                  &ldquo;{review.quote}&rdquo;
                </p>

                <div style={{ borderTop: "2px solid var(--ink)", paddingTop: "0.6rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>{review.name}</div>
                  <div style={{ fontWeight: 600, fontSize: "0.72rem", color: "var(--muted)" }}>{review.date}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
