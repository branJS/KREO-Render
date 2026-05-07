// lib/sanity.ts
import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const hasSanityConfig = Boolean(projectId && dataset);

if (!hasSanityConfig && process.env.NODE_ENV !== 'production') {
  // @sanity/client 5+ throws on empty `projectId` at construction time, so we
  // can't pass empty strings. Fall back to placeholder values that pass
  // validation but won't resolve over the network — fetches return no
  // results and callers fall back to placeholders.
  console.warn(
    '[sanity.ts] NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET ' +
    'is missing from .env.local. Sanity client is using placeholder ' +
    'credentials; data fetches will return no results until env vars are set.'
  );
}

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset: dataset || 'production',
  apiVersion: '2025-01-01', // freeze API version to guarantee predictable fields
  useCdn: true, // true = faster, cached; false = fresh data
});
