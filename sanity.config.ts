import {defineConfig} from 'sanity';
import {deskTool} from 'sanity/desk';
import {visionTool} from '@sanity/vision';
import {media} from 'sanity-plugin-media';
import {schemaTypes} from './sanity/schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default defineConfig({
  name: 'default',
  title: 'KREO Studio',
  projectId: projectId ?? '',
  dataset: dataset ?? '',
  basePath: '/studio',
  plugins: [deskTool(), visionTool(), media()],
  schema: {
    types: schemaTypes,
  },
});
