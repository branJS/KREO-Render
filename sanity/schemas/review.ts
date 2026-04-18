import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'review',
  title: 'Reviews',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Client Name', type: 'string', validation: R => R.required() }),
    defineField({ name: 'role', title: 'Role / Company', type: 'string' }),
    defineField({ name: 'quote', title: 'Review', type: 'text', validation: R => R.required() }),
    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      validation: R => R.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({ name: 'avatar', title: 'Avatar / Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Sort Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
});
