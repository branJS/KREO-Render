/*
 * AboutStore - manages storage for the About section of the portfolio.
 *
 * The About section can include an avatar image and a list of experience
 * entries. Each experience entry can have a company name, role, period,
 * logo URL, a website, and a highlight flag.
 *
 * Data is stored in localStorage using two keys: a draft key for
 * in-progress edits, and a published key for the public snapshot. The
 * store exposes helpers to load and persist both draft and published
 * versions, as well as publish drafts.
 */

export interface Experience {
  id: string;
  company: string;
  role?: string;
  period?: string;
  logoUrl?: string;
  website?: string;
  highlight?: boolean;
}

export interface About {
  name?: string;
  tagline?: string;
  bio?: string;
  avatarUrl?: string;
  experiences: Experience[];
  draft?: boolean;
}

const DRAFT_KEY = 'kreo:about:draft';
const PUBLISHED_KEY = 'kreo:about:published';

function read(key: string): About | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as About) : null;
  } catch (e) {
    console.error('Failed to read about from localStorage', e);
    return null;
  }
}

function write(key: string, value: About) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to write about to localStorage', e);
  }
}

export const AboutStore = {
  /**
   * Load the draft version of the About data. If none exists, returns a
   * default empty structure.
   */
  getDraft(): About {
    const data = read(DRAFT_KEY);
    return data || { experiences: [], draft: true };
  },
  /**
   * Save the draft version to localStorage. Sets draft flag to true.
   */
  saveDraft(data: About) {
    write(DRAFT_KEY, { ...data, draft: true });
  },
  /**
   * Publish the draft: copies the given data to the published key and
   * removes the draft flag. Returns the published version.
   */
  publish(data: About): About {
    const published: About = { ...data };
    delete published.draft;
    write(PUBLISHED_KEY, published);
    return published;
  },
  /**
   * Load the published version of the About data. If none exists,
   * returns an empty structure.
   */
  getPublished(): About {
    const data = read(PUBLISHED_KEY);
    return data || { experiences: [] };
  },
};