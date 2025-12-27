"use client";

import { useEffect, useState } from "react";
import { groq } from "next-sanity";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.warn(
      '[ContactSection] NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is missing.\n' +
      'Contact content will not load until these environment variables are provided.'
    );
  }
}

const client = createClient({
  projectId: projectId ?? '',
  dataset: dataset ?? '',
  apiVersion: "2025-01-01",
  useCdn: true,
});

type Contact = {
  title?: string;
  email?: string;
  message?: string;
  socials?: string[];
};

const query = groq`*[_type == "contact" && !(_id in path("drafts.**"))][0]{
  title, email, message, socials
}`;

export default function ContactSection() {
  const [data, setData] = useState<Contact | null>(null);

  useEffect(() => {
    client.fetch<Contact>(query).then(setData).catch(console.error);
  }, []);

  return (
    <section id="contact" className="section">
      <div className="panel center">
        <h2 className="title">{data?.title ?? "Contact"}</h2>
        {!data && <p>Loading contact info…</p>}
        {data && (
          <>
            {data.message && <p>{data.message}</p>}
            {data.email && (
              <p>
                Email: <a href={`mailto:${data.email}`}>{data.email}</a>
              </p>
            )}
            {!!data.socials?.length && (
              <ul>
                {data.socials.map((url, i) => (
                  <li key={i}>
                    <a href={url} target="_blank" rel="noreferrer">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}
