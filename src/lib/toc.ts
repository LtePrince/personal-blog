export interface TocItem {
  level: number;
  text: string;
  id: string;
}

/**
 * Extract headings (h2–h4) from raw Markdown text.
 *
 * Generates the same slug that rehype-slug produces so the TOC links
 * match the rendered heading `id` attributes.
 */
export function extractHeadings(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    // Match lines like "## Title", "### Sub-title" etc.
    // Skip h1 (single #) — it's hidden in the rendered output.
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (!match) continue;

    const level = match[1].length; // 2, 3, or 4
    const text = match[2].trim();
    const id = slugify(text);

    items.push({ level, text, id });
  }

  return items;
}

/**
 * Produce a URL-safe slug identical to rehype-slug's default behaviour.
 *
 * rehype-slug uses github-slugger under the hood:
 *   lowercase → trim → replace spaces with hyphens → strip non-alphanumeric
 *   (except hyphens, CJK characters, and other unicode letters).
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}\-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
