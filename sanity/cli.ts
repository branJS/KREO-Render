import {defineCliConfig} from 'sanity/cli';

/*
 * Sanity CLI configuration
 *
 * Defines the API project ID and dataset for the Sanity CLI.  This file
 * reads from the same environment variables used by the Studio.  If
 * these variables are not set the CLI will fall back to empty strings,
 * which prevents accidental writes to the wrong project.
 */

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? '',
  },
  // Specify the Studio path so the CLI knows where to find the configuration
  studio: {
    basePath: '/studio',
  },
});