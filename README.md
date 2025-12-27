This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Sanity CMS integration

This project is configured to work with [Sanity CMS](https://www.sanity.io/) out of the box.  The Studio is
embedded under the `/studio` route and the frontend fetches content from
your Sanity dataset.  To enable this functionality you must set a few
environment variables:

1. **NEXT_PUBLIC_SANITY_PROJECT_ID** – The ID of your Sanity project.
2. **NEXT_PUBLIC_SANITY_DATASET** – The dataset name (e.g. `production`).
3. **SANITY_API_TOKEN** (optional) – A token with write permissions if you
   plan to create or edit documents via the Studio.

Create a `.env.local` file in the project root and define these
variables.  Example:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectId
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk____yourWriteTokenHere
```

After setting up the environment variables install the dependencies if you
haven't already:

```bash
npm install
```

Then run the development server and visit `http://localhost:3000/studio`
to access the Sanity Studio.  You can create `about`, `contact` and
`project` documents which will automatically populate the corresponding
sections of the site.


## Content management and media library

In addition to the Sanity integration, this project includes an
**admin editor** under the `/admin` route that makes it easy to update
your site content without touching code.  It provides the following
features:

1. **Media library with bulk uploads.**  The editor integrates the
   [Cloudinary Upload Widget](https://cloudinary.com/documentation/upload_widget)
   to make image management painless.  You can upload multiple files at
   once and they will be stored in your Cloudinary account.  Previously
   uploaded images remain available in the library so you can reuse
   assets across pages.  To enable this, add the following variables to
   your `.env.local` file:

   ```bash
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=yourCloudName
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=unsignedUploadPreset
   ```

   Create an unsigned upload preset in your Cloudinary console and
   substitute its name above.  See the [Cloudinary docs](https://cloudinary.com/documentation/upload_widget)
   for details.

2. **Inline rich text editing.**  The admin page uses a WYSIWYG editor
   powered by [Quill](https://quilljs.com/) so you can edit page
   content directly in your browser.  You can format text, insert
   headings, lists, links and embed images from your media library via
   the “Insert Image” tool.  Changes are stored as a draft until you
   publish.

3. **Preview and publish workflow.**  When editing, you can save your
   changes as a draft and preview them locally without affecting the
   public site.  Once you’re satisfied, click **Publish** to make the
   updates live.  This mirrors the workflow of platforms like
   Portfoliobox: you can freely experiment with content and only deploy
   it when ready.  Individual pages or sections can also be kept
   unpublished until they are finished.

To try it out, run the dev server and visit `http://localhost:3000/admin`.
Upload some images, edit text and publish.  The editor is a starting
point; feel free to customise it further or connect the draft/publish
actions to your CMS of choice.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
