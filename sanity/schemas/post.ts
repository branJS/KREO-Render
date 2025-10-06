export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'body', title: 'Content', type: 'array', of: [{ type: 'block' }] },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
  ],
}
