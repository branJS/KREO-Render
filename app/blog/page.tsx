import type { Metadata } from "next";
import { getAllPosts } from "../../lib/blog";
import BlogIndex from "./components/BlogIndex";

const SITE_URL = "https://kreostudio.co.uk";

export const metadata: Metadata = {
  title: "Journal — Design Thinking & Brand Strategy | KREO Studio Plymouth",
  description:
    "Colour psychology, motion design, logo theory and branding strategy — the KREO Studio journal. Design insights for businesses in Plymouth, Devon and the wider UK.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "KREO Journal — Design Thinking & Brand Strategy",
    description:
      "Brand strategy, design theory, and creative insight from KREO Studio — Plymouth's graphic design and motion studio.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogIndex posts={posts} />;
}
