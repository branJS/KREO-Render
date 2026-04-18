import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'shopItem',
  title: 'Shop Items',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Product Name', type: 'string', validation: R => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'price', title: 'Price (£)', type: 'number', validation: R => R.required().min(0) }),
    defineField({ name: 'image', title: 'Product Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'paypalLink', title: 'PayPal Buy Link', type: 'url', description: 'Full PayPal checkout or PayPal.me link' }),
    defineField({ name: 'fileType', title: 'File Type (e.g. PSD, AI, PNG)', type: 'string' }),
    defineField({ name: 'available', title: 'Available for Purchase', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'Sort Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'price', media: 'image' },
    prepare({ title, subtitle, media }: any) {
      return { title, subtitle: subtitle ? `£${subtitle}` : 'No price set', media };
    },
  },
});
