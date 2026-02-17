import type { Metadata } from "next";
import type { Education, TechCategory, FriendLink, SponsorQR } from "@/types/about";
import Navbar from "@/components/layout/Navbar";
import EducationSection from "@/components/about/EducationSection";
import TechStack from "@/components/about/TechStack";
import FriendLinks from "@/components/about/FriendLinks";
import SponsorSection from "@/components/about/SponsorSection";

export const metadata: Metadata = {
  title: "About",
  description: "About Whalefall – education, tech stack and links",
};

/* ------------------------------------------------------------------ */
/*  Placeholder data – replace with CMS / config later                 */
/* ------------------------------------------------------------------ */

const education: Education[] = [
  {
    school: "Some University",
    degree: "Bachelor",
    major: "Computer Science",
    period: "2020 – 2024",
  },
];

const techStack: TechCategory[] = [
  {
    name: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Astro", "Svelte"],
  },
  {
    name: "Backend",
    items: ["Go", "Node.js", "Python", "MongoDB", "PostgreSQL", "Redis"],
  },
  {
    name: "DevOps & Tools",
    items: ["Docker", "Nginx", "GitHub Actions", "Linux", "Vercel"],
  },
];

const friendLinks: FriendLink[] = [
  {
    id: "1",
    name: "Next.js",
    url: "https://nextjs.org",
    description: "The React framework for the Web",
  },
  {
    id: "2",
    name: "Astro",
    url: "https://astro.build",
    description: "The web framework for content-driven websites",
  },
];

const sponsorQRCodes: SponsorQR[] = [
  { label: "WeChat Pay", src: "/images/wechat-pay-qr.png" },
  { label: "Alipay", src: "/images/alipay-qr.png" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="h-16" />

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="flex flex-col gap-6">
          <EducationSection items={education} />
          <TechStack categories={techStack} />
          <FriendLinks links={friendLinks} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <SponsorSection qrCodes={sponsorQRCodes} />
        </div>
      </main>
    </>
  );
}
