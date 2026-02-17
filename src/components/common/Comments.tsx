"use client";

import Giscus from "@giscus/react";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Giscus comment widget. Configuration is driven by env variables.
 */
export default function Comments() {
  const { theme } = useTheme();

  return (
    <Giscus
      repo={(process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`) ?? "LtePrince/Discussion"}
      repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "R_kgDOOr48BQ"}
      category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "Q&A"}
      categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "DIC_kwDOOr48Bc4CqR-D"}
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme === "dark" ? "dark" : "light"}
      lang="en"
      strict="0"
    />
  );
}
