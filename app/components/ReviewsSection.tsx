"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

const QUERY = groq`*[_type == "review"] | order(order asc) {
  _id, name, role, quote, rating, featured
}`;

const PLACEHOLDERS = [
  { _id: "ph1", name: "lilohs",         role: "Google Review ★★★★★", quote: "Awesome guy to work with and insanely talented. Recommend 200%",                                                            rating: 5 },
  { _id: "ph2", name: "Dylan Polchies", role: "Google Review ★★★★★", quote: "Highly recommended always delivering quality work!",                                                                        rating: 5 },
  { _id: "ph3", name: "jay osoria",     role: "Google Review ★★★★★", quote: "Very very professional graphic work, and extremely reliable with time. Good pricing! Highly recommend!!",                   rating: 5 },
  { _id: "ph4", name: "Jaze LTD",       role: "Google Review ★★★★★", quote: "Worked with them frequently for a variety of design services, top class!",                                                  rating: 5 },
  { _id: "ph5", name: "Mustafa Aijaz",  role: "Google Review ★★★★★", quote: "Very reliable designer. Capable of any style and needs as per my request. Highly recommend!",                              rating: 5 },
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

export default function ReviewsSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    client
      .fetch(QUERY)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => { setReviews(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const display = reviews.length > 0 ? reviews : PLACEHOLDERS;
  const isEmpty = reviews.length === 0 && !loading;

  // Duplicate track for seamless infinite scroll (2 copies → -50% animation)
  const track = [...display, ...display];

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
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {isEmpty && (
              <span style={{ color: "var(--muted)", fontWeight: 600, fontSize: "0.78rem" }}>
                Add via Studio → Reviews
              </span>
            )}
            <span style={{ fontWeight: 700, fontSize: "0.72rem", opacity: 0.55 }}>via Google</span>
            <span className="btn b-yellow tiny" style={{ fontSize: "0.68rem", boxShadow: "3px 3px 0 var(--ink)" }}>
              ★ 5.0 · {display.length} Reviews
            </span>
          </div>
        </div>

        {/* Conveyor belt */}
        {loading ? (
          <p style={{ padding: "1.5rem 1.2rem", color: "var(--muted)", fontWeight: 600 }}>Loading reviews…</p>
        ) : (
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
                <div
                  key={`${review._id}-${i}`}
                  style={{
                    width: "320px",
                    flexShrink: 0,
                    background: "#fff",
                    border: "3px solid var(--ink)",
                    boxShadow: "6px 6px 0 var(--ink)",
                    padding: "1.1rem",
                    borderTop: "6px solid var(--yellow)",
                  }}
                >
                  <Stars rating={review.rating || 5} />
                  <p style={{
                    fontWeight: 600, lineHeight: 1.6, margin: "0 0 0.9rem",
                    fontSize: "0.88rem", fontStyle: "italic",
                    color: "var(--ink)",
                  }}>
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <div style={{ borderTop: "2px solid var(--ink)", paddingTop: "0.6rem" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>{review.name}</div>
                    {review.role && (
                      <div style={{ fontWeight: 600, fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.15rem" }}>
                        {review.role}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
