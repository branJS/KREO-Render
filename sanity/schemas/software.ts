import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'software',
  title: 'Software Portfolio',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Name',
      type: 'string',
      validation: R => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short summary of what the software does.',
    }),
    defineField({
      name: 'image',
      title: 'Screenshot / Cover',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. Python, React, Node, Rust...',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Released', value: 'released' },
          { title: 'In Development', value: 'in-development' },
          { title: 'Open Source', value: 'open-source' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'released',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'demoUrl',
      title: 'Live Demo / Download URL',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'image' },
    prepare({ title, subtitle, media }: any) {
      const labels: Record<string, string> = {
        released: '✅ Released',
        'in-development': '🔧 In Development',
        'open-source': '🌐 Open Source',
        archived: '📦 Archived',
      };
      return { title, subtitle: labels[subtitle] ?? subtitle, media };
    },
  },
});
