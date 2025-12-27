import {defineType, defineField} from 'sanity';

/*
 * Blog post document schema
 *
 * Defines the shape of a blog post.  Each post has a title, a slug
 * generated from the title, and rich text content stored as an array
 * of blocks.  Additional fields such as published date or author
 * information can be added as needed.
 */

export default defineType({
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
});