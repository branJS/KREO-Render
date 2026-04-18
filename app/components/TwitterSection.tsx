"use client";

import { useEffect, useRef } from "react";

const TWITTER_HANDLE = "kreoxi";

export default function TwitterSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => {
      if ((window as any).twttr?.widgets) {
        (window as any).twttr.widgets.load(containerRef.current);
      }
    };

    if ((window as any).twttr) {
      load();
    } else {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = load;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section id="twitter" className="section">
      <div className="panel">
        <div className="panel-head">
          <h2 className="section-title" style={{ margin: 0 }}>Latest on X</h2>
          <a
            href={`https://x.com/${TWITTER_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn b-black tiny"
          >
            @{TWITTER_HANDLE} ↗
          </a>
        </div>

        <div
          ref={containerRef}
          style={{
            maxHeight: "520px",
            overflowY: "auto",
            border: "3px solid var(--ink)",
            boxShadow: "6px 6px 0 var(--ink)",
            marginTop: "0.8rem",
            background: "#fff",
          }}
        >
          <a
            className="twitter-timeline"
            data-height="516"
            data-theme="light"
            data-chrome="noheader nofooter noborders"
            href={`https://twitter.com/${TWITTER_HANDLE}`}
          >
            Loading tweets…
          </a>
        </div>
      </div>
    </section>
  );
}
