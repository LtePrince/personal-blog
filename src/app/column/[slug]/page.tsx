import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { ColumnDetail } from "@/types/column";
import ColumnLanding from "@/components/column/ColumnLanding";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getColumn(slug: string): Promise<ColumnDetail | null> {
  return apiFetch<ColumnDetail>(`columns/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getColumn(slug);
  if (!data) return { title: "Column not found" };

  return {
    title: data.title,
    description: data.summary ?? "",
    alternates: { canonical: `/column/${slug}` },
    openGraph: {
      title: data.title,
      description: data.summary ?? "",
      url: `/column/${slug}`,
      type: "website",
    },
  };
}

export default async function ColumnPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getColumn(slug);
  if (!data) notFound();
  return <ColumnLanding data={data} />;
}
