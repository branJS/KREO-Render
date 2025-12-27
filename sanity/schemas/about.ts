import {defineType, defineField} from 'sanity';

/*
 * About document schema
 *
 * Defines a simple document used to populate the About section of the
 * website.  Editors can specify a title and rich text body.  The body
 * uses the default Sanity Portable Text blocks which are rendered on
 * the front‑end with the `@portabletext/react` package.
 */

export default defineType({
  name: 'about',
  title: 'About Section',
  type: 'document',
  fields: [
    // A short headline for the about section
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    // Longer body copy for the about section
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
    }),
  ],
});