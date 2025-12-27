import {defineConfig, defineField, defineType} from 'sanity';
import {deskTool} from 'sanity/desk';
import {visionTool} from '@sanity/vision';
import {schemaTypes} from './schemas';

/*
 * Sanity Studio configuration
 *
 * This file configures the embedded Sanity Studio that lives under
 * `/studio` in the Next.js application.  It reads your project ID
 * and dataset from environment variables (set in `.env.local`) and
 * registers the desk and vision tools.  The `schemaTypes` array is
 * imported from `./schemas` and contains the document definitions for
 * the About page, Contact info, and Projects.  Feel free to extend
 * or modify these definitions to fit your needs.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  console.warn(
    '[sanity.config] NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is missing.\n' +
    'The Sanity Studio will not be able to connect to a dataset until these are set in your environment.'
  );
}

export default defineConfig({
  name: 'default',
  title: 'Kreo Studio',
  projectId: projectId ?? '',
  dataset: dataset ?? '',
  basePath: '/studio',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});