type LockableProject = {
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  tags?: string[] | null;
};

export function isUniversityDesignPortfolio(project: LockableProject) {
  const haystack = [
    project.title,
    project.slug,
    project.description,
    ...(project.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const identity = [project.title, project.slug].filter(Boolean).join(" ").toLowerCase();

  return (
    identity.includes("design portfolio") ||
    identity.includes("design-portfolio") ||
    (haystack.includes("university") &&
      (haystack.includes("design portfolio") || haystack.includes("portfolio")))
  );
}
