// sanity.config.js (in project root)
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas' // ✅ make sure this path matches your folder

export default defineConfig({
  name: 'default',
  title: 'KREO Studio',
  projectId: '4141r3mh',  // ✅ your project ID
  dataset: 'production',  // ✅ use 'production' or the dataset you created
  basePath: '/studio',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,   // ✅ this must match the export in index.ts
  },
})
