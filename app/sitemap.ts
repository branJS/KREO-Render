import { MetadataRoute } from "next";
import { fetchAllPosts } from "@/lib/blog";
import { getProjects } from "@/lib/sanity.server";

const SITE_URL = "https://www.kreostudio.co.uk";
const STATIC_LAST_MODIFIED = "2026-05-07T00:00:00.000Z";

type ProjectSitemapEntry = {
  slug?: string | null;
  publishedAt?: string | null;
  _updatedAt?: string | null;
};

function page(
  path = "",
  options: {
    lastModified?: string;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  } = {}
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: options.lastModified ?? STATIC_LAST_MODIFIED,
    changeFrequency: options.changeFrequency ?? "monthly",
    priority: options.priority ?? 0.7,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([
    fetchAllPosts(),
    getProjects() as Promise<ProjectSitemapEntry[]>,
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    page("", { changeFrequency: "weekly", priority: 1.0 }),
    page("/graphic-design-plymouth", { priority: 0.9 }),
    page("/web-design-plymouth", { priority: 0.9 }),
    page("/logo-design-plymouth", { priority: 0.9 }),
    page("/projects", { changeFrequency: "weekly", priority: 0.85 }),
    page("/blog", { changeFrequency: "weekly", priority: 0.8 }),
  ];

  const blogPages = posts.map((post) =>
    page(`/blog/${post.slug}`, {
      lastModified: post.date,
      changeFrequency: "monthly",
      priority: 0.75,
    })
  );

  const projectPages = projects
    .filter((project) => project.slug)
    .map((project) =>
      page(`/projects/${project.slug}`, {
        lastModified: project._updatedAt ?? project.publishedAt ?? STATIC_LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: 0.72,
      })
    );

  return [...staticPages, ...projectPages, ...blogPages];
}
