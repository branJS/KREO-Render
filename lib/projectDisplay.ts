type ProjectLike = {
  title?: string | null;
  category?: string | null;
  slug?: string | null;
};

export function isMotionProject(project: ProjectLike) {
  const haystack = [project.title, project.category, project.slug]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    haystack.includes("motion design") ||
    haystack.includes("motion reel") ||
    haystack.includes("motion")
  );
}

export const REAL_ESTATE_AGENCY_PROJECT = {
  _id: "real-estate-agency-coming-soon",
  title: "Real Estate Agency Projects",
  slug: "#real-estate-agency-projects",
  category: "property",
  description:
    "Cinematic property marketing, launch decks, CGI stills, and private visual systems. Work is available on request while the public case studies are being prepared.",
  coverImage: null,
  featured: false,
  tags: ["Property Marketing", "Investor Decks", "Launch Films"],
};
