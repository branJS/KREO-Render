import { createClient, groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET;

export const client = createClient({
  projectId: projectId ?? '',
  dataset: dataset ?? '',
  apiVersion: "2025-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

// Build a Sanity image URL from an image reference object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

export async function getProjects() {
  if (!projectId || !dataset) return [];
  const query = groq`*[_type == "project" && !(_id in path("drafts.**"))] | order(order asc, publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    description,
    coverImage,
    featured
  }`;
  try {
    return await client.fetch(query);
  } catch (err) {
    console.error('[getProjects] Failed to fetch projects from Sanity', err);
    return [];
  }
}

export async function getProject(slug: string) {
  if (!projectId || !dataset) return null;
  const query = groq`*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    description,
    coverImage,
    gallery[] {
      ...,
      "url": asset->url,
      caption,
      alt
    },
    videoUrl,
    tags,
    url,
    publishedAt
  }`;
  try {
    return await client.fetch(query, { slug });
  } catch (err) {
    console.error('[getProject] Failed to fetch project from Sanity', err);
    return null;
  }
}
