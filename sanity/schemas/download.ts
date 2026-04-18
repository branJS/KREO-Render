import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'download',
  title: 'Downloads',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'File Title', type: 'string', validation: R => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      description: 'Upload any file type — PDF, ZIP, PSD, etc.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Brand Pack', value: 'brand-pack' },
          { title: 'Press Kit', value: 'press-kit' },
          { title: 'Case PDF', value: 'case-pdf' },
          { title: 'Template', value: 'template' },
          { title: 'Resource', value: 'resource' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({ name: 'free', title: 'Free Download', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'Sort Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
});
