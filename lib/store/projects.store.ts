/*
 * ProjectStore - simple localStorage-based storage for portfolio projects.
 *
 * Projects can exist in two states: draft and published. Draft projects are
 * editable and not shown on the public portfolio grid. Published projects
 * represent the last published snapshot and are visible on the public site.
 *
 * Each project has a slug (used as the URL) and contains a title,
 * description (HTML), and an array of images (data URLs or remote URLs).
 * This store manages reading and writing to localStorage, including lists
 * and individual projects.
 */

export interface ProjectImage {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  descriptionHTML: string;
  images: ProjectImage[];
  status: 'draft' | 'published';
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
}

const DRAFT_KEY = 'kreo:draft:projects';
const PUBLISHED_KEY = 'kreo:published:projects';

function readMap(key: string): Record<string, Project> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, Project>) : {};
  } catch (e) {
    console.error('Failed to read localStorage', e);
    return {};
  }
}

function approxBytes(obj: unknown): number {
  // Roughly estimate the number of bytes required to store the object
  try {
    return new TextEncoder().encode(JSON.stringify(obj)).length;
  } catch {
    return Infinity;
  }
}

function writeMap(key: string, data: Record<string, Project>) {
  if (typeof window === 'undefined') return;
  try {
    // Prevent oversize writes to localStorage. Browsers typically allow
    // around 5–10MB per origin. If the data map exceeds ~4.5MB we skip
    // persisting it and warn. This encourages the use of Cloudinary to
    // store image URLs instead of large data URIs.
    const bytes = approxBytes(data);
    const limit = 4.5 * 1024 * 1024; // 4.5 MB
    if (bytes > limit) {
      console.warn(
        `Prevented large localStorage write (~${(bytes / (1024 * 1024)).toFixed(
          2
        )} MB). Enable Cloudinary or reduce image sizes.`
      );
      throw new Error('Local draft too large; enable Cloudinary to publish.');
    }
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to write localStorage', e);
    throw e;
  }
}

export const ProjectStore = {
  /**
   * Returns a list of published projects sorted by publishedAt descending.
   */
  listPublished(): Project[] {
    const map = readMap(PUBLISHED_KEY);
    return Object.values(map).sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
  },
  /**
   * Returns a list of all draft projects sorted by updatedAt descending.
   */
  listDrafts(): Project[] {
    const map = readMap(DRAFT_KEY);
    return Object.values(map).sort((a, b) => b.updatedAt - a.updatedAt);
  },
  /**
   * Returns a draft project by slug, if it exists.
   */
  getDraft(slug: string): Project | undefined {
    const map = readMap(DRAFT_KEY);
    return map[slug];
  },
  /**
   * Returns a published project by slug, if it exists.
   */
  getPublished(slug: string): Project | undefined {
    const map = readMap(PUBLISHED_KEY);
    return map[slug];
  },
  /**
   * Creates a new draft project and returns it. The slug must be unique.
   */
  createDraft(p: Project): Project {
    const drafts = readMap(DRAFT_KEY);
    drafts[p.slug] = p;
    writeMap(DRAFT_KEY, drafts);
    return p;
  },
  /**
   * Updates an existing draft project. Returns the updated project.
   */
  updateDraft(p: Project): Project {
    const drafts = readMap(DRAFT_KEY);
    drafts[p.slug] = p;
    writeMap(DRAFT_KEY, drafts);
    return p;
  },
  /**
   * Publishes a project with the given slug. Copies draft to published
   * snapshot and marks status as 'published'. Does not remove the draft.
   */
  publish(slug: string): Project | undefined {
    const drafts = readMap(DRAFT_KEY);
    const published = readMap(PUBLISHED_KEY);
    const draft = drafts[slug];
    if (!draft) return undefined;
    const snapshot: Project = {
      ...draft,
      status: 'published',
      publishedAt: Date.now(),
    };
    published[slug] = snapshot;
    writeMap(PUBLISHED_KEY, published);
    return snapshot;
  },
  /**
   * Generates a unique slug by ensuring no draft or published project uses it.
   */
  generateUniqueSlug(base: string): string {
    // slugify base: lower-case, replace spaces and special characters
    const slugBase = base
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    let slug = slugBase || 'project';
    let counter = 1;
    const drafts = readMap(DRAFT_KEY);
    const published = readMap(PUBLISHED_KEY);
    while (drafts[slug] || published[slug]) {
      slug = `${slugBase}-${counter}`;
      counter++;
    }
    return slug;
  },
};