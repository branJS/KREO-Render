import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'client',
  title: 'Client Logos',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: R => R.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload a PNG or SVG logo. Works best on light backgrounds.',
    }),
    defineField({
      name: 'url',
      title: 'Company URL (optional)',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
});
