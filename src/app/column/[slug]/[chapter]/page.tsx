import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { ChapterView } from "@/types/column";
import ColumnReader from "@/components/column/ColumnReader";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string; chapter: string }>;
}

async function getChapter(
  slug: string,
  chapter: string,
): Promise<ChapterView | null> {
  return apiFetch<ChapterView>(
    `columns/${encodeURIComponent(slug)}/chapters/${encodeURIComponent(chapter)}`,
    { cache: "no-store" },
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, chapter } = await params;
  const data = await getChapter(slug, chapter);
  if (!data) return { title: "Chapter not found" };

  return {
    title: `${data.current.title} · ${data.column.title}`,
    alternates: { canonical: `/column/${slug}/${chapter}` },
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug, chapter } = await params;
  const data = await getChapter(slug, chapter);
  if (!data) notFound();
  return <ColumnReader data={data} />;
}
