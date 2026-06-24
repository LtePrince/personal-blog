import type { Metadata } from "next";
import type { ServerStats, Project } from "@/types/lab";
import Navbar from "@/components/layout/Navbar";
import ServerStatus from "@/components/lab/ServerStatus";
import ProjectGrid from "@/components/lab/ProjectGrid";

export const metadata: Metadata = {
  title: "MyLab",
  description: "Server status & project showcase",
};

/* ------------------------------------------------------------------ */
/*  Placeholder data – replace with real API calls later               */
/* ------------------------------------------------------------------ */

const projects: Project[] = [
  {
    id: "1",
    title: "Personal Blog",
    description:
      "A modern personal blog built with Next.js 16, TypeScript and Tailwind CSS, featuring glassmorphism design.",
    href: "https://github.com/LtePrince/personal-blog",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    icon: "📝",
  },
  {
    id: "2",
    title: "Blog Backend",
    description:
      "Go-based REST API server with MongoDB, providing blog CRUD, weather data and system monitoring.",
    href: "https://github.com/LtePrince/blog-backend",
    tags: ["Go", "MongoDB", "REST"],
    icon: "⚙️",
  },
  {
    id: "3",
    title: "More Coming…",
    description:
      "Stay tuned! More projects and experiments are on the way.",
    tags: ["WIP"],
    icon: "🧪",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LabPage() {
  return (
    <>
      <Navbar />
      <div className="h-24" />

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[280px_1fr]">
        {/* Left column – server status (sticky only on desktop; on mobile it
            scrolls normally so it can't overlap the project cards below it) */}
        <div className="self-start lg:sticky lg:top-24">
          <ServerStatus/>
        </div>

        {/* Right column – project cards */}
        <ProjectGrid projects={projects} />
      </main>
    </>
  );
}
