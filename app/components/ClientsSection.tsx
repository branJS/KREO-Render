"use client";

import { useEffect, useState } from "react";
import { client as sanityClient } from "@/lib/sanity";
import { groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const builder = imageUrlBuilder(sanityClient as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) { return builder.image(source); }

const QUERY = groq`*[_type == "client"] | order(order asc) {
  _id, name, logo, url
}`;

// Real clients — shown until you populate Sanity → Client Logos
const PLACEHOLDER_CLIENTS = [
  { _id: "ph1",  name: "Trevi",                      logo: null, url: null },
  { _id: "ph2",  name: "University of Exeter",        logo: null, url: null },
  { _id: "ph3",  name: "Tide Ford Organics",          logo: null, url: null },
  { _id: "ph4",  name: "Luxe Living by Sophia",       logo: null, url: null },
  { _id: "ph5",  name: "Pepe",                        logo: null, url: null },
  { _id: "ph6",  name: "The Positive Birth Company",  logo: null, url: null },
  { _id: "ph7",  name: "Trevi",                       logo: null, url: null },
  { _id: "ph8",  name: "University of Exeter",        logo: null, url: null },
];

export default function ClientsSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clients, setClients] = useState<any[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    sanityClient
      .fetch(QUERY)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => { if (data?.length) setClients(data); })
      .catch(() => {});
  }, []);

  const display = clients.length > 0 ? clients : PLACEHOLDER_CLIENTS;
  // Duplicate for seamless infinite loop
  const track = [...display, ...display];

  return (
    <section id="clients" className="section" style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>

        {/* Header strip */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.7rem 1.2rem",
          borderBottom: "3px solid var(--ink)",
        }}>
          <span style={{ fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.14em" }}>
            TRUSTED BY
          </span>
          <span style={{
            background: "var(--yellow)", color: "#0D0D0D",
            border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)",
            fontWeight: 800, fontSize: "0.65rem", padding: "2px 8px",
            letterSpacing: "0.1em",
          }}>
            {display.length}+ CLIENTS
          </span>
        </div>

        {/* Marquee track */}
        <div
          style={{ overflow: "hidden", padding: "1.8rem 0" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div style={{
            display: "flex",
            width: "max-content",
            animation: `kreo-marquee 32s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
            gap: "0",
          }}>
            {track.map((c, i) => {
              const logoUrl = c.logo ? urlFor(c.logo).height(100).url() : null;
              const inner = (
                <div
                  key={`${c._id}-${i}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 3.5rem",
                    borderRight: "2px solid var(--ink)",
                    minWidth: "280px", height: "110px",
                    flexShrink: 0,
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--yellow)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={c.name}
                      style={{
                        maxHeight: "80px", maxWidth: "240px",
                        objectFit: "contain", display: "block",
                        filter: "grayscale(1) contrast(1.1)",
                        transition: "filter 0.2s ease",
                      }}
                      onMouseEnter={(e) => { (e.target as HTMLImageElement).style.filter = "none"; }}
                      onMouseLeave={(e) => { (e.target as HTMLImageElement).style.filter = "grayscale(1) contrast(1.1)"; }}
                    />
                  ) : (
                    <span style={{
                      fontWeight: 800, fontSize: "1.1rem",
                      letterSpacing: "0.06em", color: "var(--ink)",
                      whiteSpace: "nowrap", opacity: 0.75,
                      textTransform: "uppercase",
                    }}>
                      {c.name}
                    </span>
                  )}
                </div>
              );

              return c.url ? (
                <a key={`${c._id}-${i}`} href={c.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "contents" }}>
                  {inner}
                </a>
              ) : inner;
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
