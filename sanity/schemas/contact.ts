export default {
  name: 'contact',
  title: 'Contact Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
    },
    {
      name: 'message',
      title: 'Contact Message',
      type: 'text',
    },
    {
      name: 'socials',
      title: 'Social Links',
      type: 'array',
      of: [{ type: 'url' }],
    },
  ],
}
