/** Blog post summary returned by the listing API. */
export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  tags?: string[];
  cover?: string;
  author?: string;
}

/** Full blog post detail including body text. */
export interface BlogPostDetail extends BlogPost {
  text: string;
}

/** Generic envelope returned by the backend. */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Normalise tags to a string array (handles undefined / empty). */
export function parseTags(tags?: string[]): string[] {
  if (!tags || tags.length === 0) return [];
  return tags;
}
