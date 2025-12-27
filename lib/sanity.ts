// lib/sanity.ts
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  console.warn(
    '[sanity.ts] NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is missing.\n' +
    'Sanity client has been initialised with empty credentials. Data fetching will fail until these variables are provided.'
  );
}

export const client = createClient({
  projectId: projectId ?? '',
  dataset: dataset ?? '',
  apiVersion: '2025-01-01', // freeze API version to guarantee predictable fields
  useCdn: true, // true = faster, cached; false = fresh data
});
