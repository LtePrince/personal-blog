import type { Metadata } from "next";
import type { BlogPost } from "@/types/blog";
import { apiFetch } from "@/lib/api";
import ClientBlog from "@/components/blog/ClientBlog";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Browse latest posts from Whalefall",
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

async function getPosts(): Promise<BlogPost[]> {
  const data = await apiFetch<BlogPost[]>("blog", { cache: "no-store" });
  if (!Array.isArray(data)) return [];
  return data;
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <ClientBlog posts={posts} />;
}
