'use client';

/**
 * This page embeds the Sanity Studio inside your Next.js app.  Marking this
 * component as a client component ensures that the Studio is hydrated
 * correctly; otherwise `createContext` will be undefined at runtime.
 */

import { NextStudio } from 'next-sanity/studio';
// Import the studio configuration from the project root
// Note: the studio configuration lives in the project root.  From this
// nested route we need to traverse up three directories (app/studio/[[...tool]]/)
// to import the config correctly.  Using an incorrect path will cause
// a runtime error (`Module not found: Can't resolve '../../sanity.config'`).
import config from '../../../sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}