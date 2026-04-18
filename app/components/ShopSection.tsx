"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const builder = imageUrlBuilder(client as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) {
  return builder.image(source);
}

const QUERY = groq`*[_type == "shopItem" && available == true] | order(order asc) {
  _id, title, description, price, image, paypalLink, fileType
}`;

export default function ShopSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(QUERY)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => { setItems(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="shop" className="section">
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Shop</h2>
          <span
            className="btn b-yellow tiny"
            style={{ fontSize: "0.7rem", boxShadow: "3px 3px 0 var(--ink)" }}
          >
            Secure via PayPal
          </span>
        </div>

        <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: "0.9rem", margin: "0.4rem 0 1rem" }}>
          Premium design templates — purchase instantly via PayPal.
        </p>

        {loading ? (
          <p style={{ color: "var(--muted)", fontWeight: 600 }}>Loading products…</p>
        ) : items.length === 0 ? (
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              marginTop: "0.5rem",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  opacity: 0.5,
                }}
              >
                <div
                  style={{
                    height: "160px",
                    background: "#f0ebe2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "3px solid var(--ink)",
                    fontWeight: 700,
                    color: "var(--muted)",
                    fontSize: "0.85rem",
                  }}
                >
                  Coming Soon
                </div>
                <div style={{ padding: "0.8rem" }}>
                  <h3 style={{ margin: "0 0 0.3rem", fontWeight: 800 }}>PSD Template</h3>
                  <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: "0.85rem", margin: 0 }}>
                    Add products in Studio
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              marginTop: "0.5rem",
            }}
          >
            {items.map((item) => {
              const imgUrl = item.image ? urlFor(item.image).width(440).height(320).url() : null;
              return (
                <div key={item._id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                  {/* Product image */}
                  <div
                    style={{
                      height: "160px",
                      background: "#f0ebe2",
                      overflow: "hidden",
                      borderBottom: "3px solid var(--ink)",
                    }}
                  >
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={item.title}
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
                        No preview
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "0.8rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h3 style={{ margin: "0 0 0.2rem", fontSize: "0.95rem", fontWeight: 800 }}>
                        {item.title}
                      </h3>
                      {item.fileType && (
                        <span
                          className="btn tiny b-yellow"
                          style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem", boxShadow: "2px 2px 0 var(--ink)" }}
                        >
                          {item.fileType}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p
                        style={{
                          color: "var(--muted)",
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          margin: "0.2rem 0 0.6rem",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.description}
                      </p>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                        £{item.price?.toFixed(2)}
                      </span>
                      {item.paypalLink ? (
                        <a
                          href={item.paypalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn b-blue tiny"
                          style={{ fontSize: "0.8rem", boxShadow: "3px 3px 0 var(--ink)" }}
                        >
                          Buy via PayPal
                        </a>
                      ) : (
                        <span
                          className="btn tiny outline"
                          style={{ fontSize: "0.8rem", opacity: 0.5, boxShadow: "3px 3px 0 var(--ink)" }}
                        >
                          Unavailable
                        </span>
                      )}
                    </div>
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
