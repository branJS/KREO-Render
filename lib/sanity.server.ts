import { createClient, groq } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  console.warn(
    '[sanity.server.ts] NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is missing.\n' +
    'Sanity client has been initialised with empty credentials. Data fetching will fail until these variables are provided.'
  );
}

export const client = createClient({
  projectId: projectId ?? '',
  dataset: dataset ?? '',
  apiVersion: "2025-01-01",
  useCdn: true,
});

export async function getProjects() {
  // If the client is misconfigured due to missing env vars, return an empty array
  if (!projectId || !dataset) {
    return [];
  }
  const query = groq`*[_type == "project" && !(_id in path("drafts.**"))]{
    title,
    description
  }`;
  try {
    return await client.fetch(query);
  } catch (err) {
    console.error('[getProjects] Failed to fetch projects from Sanity', err);
    return [];
  }
}
