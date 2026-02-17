import type { Metadata } from "next";
import ClientBlog from "@/components/blog/ClientBlog";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Browse latest posts from Whalefall",
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

export default function BlogPage() {
  return <ClientBlog />;
}
