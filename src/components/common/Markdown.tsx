"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import "katex/dist/katex.min.css";

// Allow `id` attribute on heading elements so rehype-slug anchors survive sanitisation.
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    h1: [...(defaultSchema.attributes?.h1 ?? []), "id"],
    h2: [...(defaultSchema.attributes?.h2 ?? []), "id"],
    h3: [...(defaultSchema.attributes?.h3 ?? []), "id"],
    h4: [...(defaultSchema.attributes?.h4 ?? []), "id"],
    h5: [...(defaultSchema.attributes?.h5 ?? []), "id"],
    h6: [...(defaultSchema.attributes?.h6 ?? []), "id"],
  },
};

interface MarkdownProps {
  children: string;
}

/**
 * Render Markdown with GFM support, LaTeX math, heading anchors, and HTML
 * sanitisation.
 */
export default function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      // rehype-katex has to run *after* rehype-sanitize. Run it before, and
      // the sanitiser strips KaTeX's class names and MathML attributes, which
      // renders every formula as duplicated plain text ("x∈Rnx \in \mathbb{R}^n").
      // Sanitising first is safe: KaTeX builds its own markup from the TeX
      // source and emits no raw HTML at default settings.
      rehypePlugins={[rehypeSlug, [rehypeSanitize, sanitizeSchema], rehypeKatex]}
      components={{
        // Blog title is already shown in the page header, skip h1 in body.
        h1: () => null,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
