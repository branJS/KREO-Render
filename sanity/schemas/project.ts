import {defineType, defineField} from 'sanity';

/*
 * Project document schema
 *
 * Represents an individual project in your portfolio.  Each project has a
 * title, a description, a slug used for URL paths, and optionally an
 * image.  You can extend this with additional metadata like live URL
 * links, GitHub repositories, or tags.
 */

export default defineType({
  name: 'project',
  title: 'Projects',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    // Optional URL linking to the live project or case study
    defineField({
      name: 'url',
      title: 'Project URL',
      type: 'url',
    }),
  ],
});