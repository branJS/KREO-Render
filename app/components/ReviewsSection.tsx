"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";

const QUERY = groq`*[_type == "review"] | order(order asc) {
  _id, name, role, quote, rating, featured
}`;

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "0.5rem" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= rating ? "var(--yellow)" : "#ccc", fontSize: "1rem" }}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(QUERY)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => { setReviews(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Placeholder reviews shown while empty
  const placeholders = [
    { name: "Client Name", role: "Business Owner", quote: "Brandon delivered incredible work — fast, professional, and exactly what we needed.", rating: 5 },
    { name: "Another Client", role: "Creative Director", quote: "Outstanding visual identity. The branding package exceeded all expectations.", rating: 5 },
    { name: "Happy Customer", role: "Startup Founder", quote: "Responsive, creative, and genuinely passionate about design. Highly recommended.", rating: 5 },
  ];

  const displayReviews = reviews.length > 0 ? reviews : placeholders;
  const isEmpty = reviews.length === 0 && !loading;

  return (
    <section id="reviews" className="section">
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Reviews</h2>
          <span className="btn b-yellow tiny" style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}>
            ★ Client Feedback
          </span>
        </div>

        {loading ? (
          <p style={{ color: "var(--muted)", fontWeight: 600 }}>Loading reviews…</p>
        ) : (
          <>
            {isEmpty && (
              <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: "0.85rem", margin: "0 0 0.8rem" }}>
                Add reviews via Studio → Reviews
              </p>
            )}
            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                marginTop: "0.8rem",
                opacity: isEmpty ? 0.45 : 1,
              }}
            >
              {displayReviews.map((review, i) => (
                <div
                  key={review._id || i}
                  className="card"
                  style={{
                    borderTop: "6px solid var(--yellow)",
                    padding: "1rem",
                  }}
                >
                  <Stars rating={review.rating || 5} />
                  <p
                    style={{
                      fontWeight: 600,
                      lineHeight: 1.6,
                      margin: "0 0 0.8rem",
                      fontSize: "0.9rem",
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <div style={{ borderTop: "2px solid var(--ink)", paddingTop: "0.6rem" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>{review.name}</div>
                    {review.role && (
                      <div style={{ fontWeight: 600, fontSize: "0.78rem", color: "var(--muted)" }}>
                        {review.role}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
