"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownProps {
  children: string;
}

/**
 * Render Markdown with GFM support and HTML sanitisation.
 */
export default function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        // Blog title is already shown in the page header, skip h1 in body.
        h1: () => null,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
