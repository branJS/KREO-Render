// sanity.config.js (in project root)
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'        // Desk (content editor UI)
import {visionTool} from '@sanity/vision'   // Vision (GROQ playground, optional)
import { schemaTypes } from "./schemas";

const projectId = "4141r3mh";  // ← your real project ID here
const dataset = "production";
export default defineConfig({
  basePath: '/studio',           // Mounts the Studio at the /studio route
  projectId,
  dataset,
  title: 'My Project Content Studio', // Shown in the Sanity Studio UI
  plugins: [
    deskTool(), 
    visionTool()                 // Include Vision plugin if you want the GROQ editor
  ],
  schema: {
    types: schemaTypes           // All your document types defined in /sanity/schemas
  }
})
