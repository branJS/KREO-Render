"use client";

import { useEffect, useState } from "react";
import { groq } from "next-sanity";
import { createClient } from "next-sanity";
import { PortableText } from "@portabletext/react";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-01-01",
  useCdn: true,
});

type About = {
  title?: string;
  body?: any;
};

const query = groq`*[_type == "about" && !(_id in path("drafts.**"))][0]{title, body}`;

export default function AboutSection() {
  const [data, setData] = useState<About | null>(null);

  useEffect(() => {
    client.fetch<About>(query).then(setData).catch(console.error);
  }, []);

  return (
    <section id="about" className="section">
      <div className="panel center">
        <h2 className="title">{data?.title ?? "About"}</h2>
        {!data && <p>Loading about page…</p>}
        {data && data.body && (
          <div className="rich-text">
            <PortableText value={data.body} />
          </div>
        )}
      </div>
    </section>
  );
}
