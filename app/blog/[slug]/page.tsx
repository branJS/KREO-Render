import type { Metadata } from "next";
import { fetchPost, fetchAllPosts, fetchAllSlugs } from "../../../lib/blog";
import { notFound } from "next/navigation";
import ArticleView from "../components/ArticleView";

const SITE_URL = "https://kreostudio.co.uk";

export async function generateStaticParams() {
  const slugs = await fetchAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags.join(", "),
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["KREO Studio"],
      tags: post.tags,
      ...(post.thumbnail ? { images: [{ url: post.thumbnail }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  // Find the next post (chronologically older)
  const all = await fetchAllPosts();
  const idx = all.findIndex((p) => p.slug === slug);
  const nextPost = idx < all.length - 1 ? all[idx + 1] : all[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    ...(post.thumbnail ? { image: post.thumbnail } : {}),
    author: {
      "@type": "Organization",
      name: "KREO Studio",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "KREO Studio",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleView post={post} nextPost={nextPost ?? null} />
    </>
  );
}
