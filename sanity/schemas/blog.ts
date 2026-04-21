import { defineType, defineField } from 'sanity';

/*
 * KREO JOURNAL — Full blog post schema
 *
 * Supports every field used by the KREO Journal:
 *  - Core metadata (title, slug, description, date, readTime, tags)
 *  - Visual identity (accentColor, thumbnail, theme)
 *  - Content via rich Portable Text editor
 *  - Optional rawHtml override (paste existing HTML directly)
 *
 * Theme options control the overall post visual mode when rendered.
 */

const THEME_OPTIONS = [
  { title: 'Default (Cream)', value: 'default' },
  { title: 'Dark (Ink background)', value: 'dark' },
  { title: 'Minimal (Clean, lots of white space)', value: 'minimal' },
  { title: 'Editorial (Bold, oversized typography)', value: 'editorial' },
];

const ACCENT_PRESETS = [
  { title: 'KREO Yellow', value: '#F5C100' },
  { title: 'Teal', value: '#00B6A3' },
  { title: 'Blue', value: '#1E6FE0' },
  { title: 'Red', value: '#E24C3A' },
  { title: 'Green', value: '#2DBA72' },
  { title: 'Pink', value: '#E56BE3' },
  { title: 'Ink (Black)', value: '#0D0D0D' },
];

export default defineType({
  name: 'blogPost',
  title: 'Journal Posts',
  type: 'document',

  fields: [
    /* ── Core metadata ───────────────────────────────────────── */
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required().min(5).max(120),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'Auto-generated from title — used in the URL e.g. /blog/your-slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),

    defineField({
      name: 'description',
      title: 'Excerpt / Meta Description',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on cards and in search engines (120–160 chars ideal)',
      validation: (R) => R.required().max(200),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      options: { dateFormat: 'YYYY-MM-DD', timeStep: 60 },
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'readTime',
      title: 'Read Time',
      type: 'string',
      description: 'e.g. "6 min read" — displayed on cards and in the article header',
      placeholder: '6 min read',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Used for tag filtering on the Journal index page',
    }),

    /* ── Visual identity ─────────────────────────────────────── */
    defineField({
      name: 'accentColor',
      title: 'Accent Colour',
      type: 'string',
      description: 'CSS colour value — drives the drop cap, blockquote border, tag badges and progress bar',
      options: {
        list: ACCENT_PRESETS,
        layout: 'radio',
      },
      initialValue: '#F5C100',
    }),

    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown on index cards and as a darkened hero background on the featured post',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describes the image for screen readers and SEO',
        }),
      ],
    }),

    defineField({
      name: 'theme',
      title: 'Post Theme / Mode',
      type: 'string',
      description: 'Controls the overall visual mode of the article page',
      options: { list: THEME_OPTIONS, layout: 'radio' },
      initialValue: 'default',
    }),

    /* ── Content ─────────────────────────────────────────────── */
    defineField({
      name: 'body',
      title: 'Article Content (Rich Text Editor)',
      type: 'array',
      description: 'Write your article here using the rich text editor',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Paragraph',  value: 'normal' },
            { title: 'Heading 2',  value: 'h2' },
            { title: 'Heading 3',  value: 'h3' },
            { title: 'Pull Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet List',   value: 'bullet' },
            { title: 'Numbered List', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold',   value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL',
                    description: 'Use / for internal links or https:// for external',
                    validation: (R: any) => R.uri({ allowRelative: true }),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        /* Embedded images in the article */
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption (optional)',
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'rawHtml',
      title: 'Raw HTML Override (Advanced)',
      type: 'text',
      rows: 20,
      description:
        'Optional — if filled, this HTML is used INSTEAD of the rich text editor above. ' +
        'Use this to paste the existing KREO post HTML exactly. Leave blank to use the rich text body.',
    }),
  ],

  /* ── Studio preview card ─────────────────────────────────── */
  preview: {
    select: {
      title:    'title',
      subtitle: 'description',
      media:    'thumbnail',
      date:     'publishedAt',
      theme:    'theme',
    },
    prepare({ title, subtitle, media, date, theme }: any) {
      const d = date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date';
      return {
        title:    title ?? 'Untitled post',
        subtitle: `${d} · ${theme ?? 'default'} — ${subtitle ?? ''}`,
        media,
      };
    },
  },

  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Oldest first',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
});
