/*
 * Aggregate all document schemas into a single array.  This file is
 * imported by `sanity.config.ts` to register types with the Studio.
 */

import about from './about';
import contact from './contact';
import project from './project';
import blogPost from './blog';

// Register all document types for the Sanity Studio
export const schemaTypes = [project, about, contact, blogPost];