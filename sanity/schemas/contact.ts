import {defineType, defineField} from 'sanity';

/*
 * Contact document schema
 *
 * This document holds contact information for your portfolio site.  It
 * includes a title, an email address, a call‑to‑action message and a
 * list of socials (stored as URL fields).  Feel free to add new
 * fields such as phone numbers or location coordinates if needed.
 */

export default defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
    }),
    defineField({
      name: 'socials',
      title: 'Social Links',
      type: 'array',
      of: [{ type: 'url' }],
    }),
  ],
});