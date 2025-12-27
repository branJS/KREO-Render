import {defineConfig} from 'sanity';
import {deskTool} from 'sanity/desk';
import {visionTool} from '@sanity/vision';

/*
 * Sanity Studio configuration
 *
 * This configuration file lives at the project root and is imported by the
 * Studio route (`/app/studio/[[...tool]]/page.tsx`). It defines your
 * project ID, dataset, title and which plugins to enable.  Document
 * schemas are pulled in from the `./sanity/schemas` directory.
 */

// Import schema types from the `sanity/schemas` directory
import {schemaTypes} from './sanity/schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default defineConfig({
  name: 'default',
  title: 'KREO Studio',
  projectId: projectId ?? '',
  dataset: dataset ?? '',
  basePath: '/studio',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});