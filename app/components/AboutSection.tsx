"use client";

import { useEffect, useState } from "react";
import { groq } from "next-sanity";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  // Warn once when in development mode.  In production this will
  // silently fall back to showing the placeholder content defined below.
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.warn(
      '[AboutSection] NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is missing.\n' +
      'About content will not load until these environment variables are provided.'
    );
  }
}

const client = createClient({
  projectId: projectId ?? '',
  dataset: dataset ?? '',
  apiVersion: "2025-01-01",
  useCdn: true,
});

type About = {
  headline?: string;
  body?: string;
};

const query = groq`*[_type == "about" && !(_id in path("drafts.**"))][0]{headline, body}`;

export default function AboutSection() {
  const [data, setData] = useState<About | null>(null);

  useEffect(() => {
    client.fetch<About>(query).then(setData).catch(console.error);
  }, []);

  return (
    <section id="about" className="section">
      <div className="panel center">
        <h2 className="title">{data?.headline ?? "About"}</h2>
        {!data && <p>Loading about page…</p>}
        {data && data.body && (
          <p>{data.body}</p>
        )}
      </div>
    </section>
  );
}
