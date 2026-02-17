import type { Metadata } from "next";
import type { BlogPostDetail } from "@/types/blog";
import { apiFetch } from "@/lib/api";
import ClientDetail from "@/components/blog/ClientDetail";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */
/*  Data fetching                                                      */
/* ------------------------------------------------------------------ */

async function getPost(id: string): Promise<BlogPostDetail | null> {
  return apiFetch<BlogPostDetail>(`blog/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
}

/* ------------------------------------------------------------------ */
/*  Dynamic metadata                                                   */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getPost(id);
  if (!data) return { title: "Post not found" };

  return {
    title: data.title,
    description: data.summary ?? "",
    alternates: { canonical: `/blog/${id}` },
    openGraph: {
      title: data.title,
      description: data.summary ?? "",
      url: `/blog/${id}`,
      type: "article",
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getPost(id);

  if (!data) notFound();

  /* JSON-LD structured data */
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.summary ?? "",
    datePublished: data.date ?? undefined,
    author: data.author
      ? [{ "@type": "Person", name: data.author }]
      : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${base}/blog/${id}` },
  };

  return (
    <>
      <ClientDetail data={data} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
