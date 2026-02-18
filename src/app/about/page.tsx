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
    school: "Huazhong University of Science and Technology",
    degree: "Bachelor",
    major: "Computer Science",
    period: "2021 – 2025",
  },
  {
    school: "University of Sydney",
    degree: "Master",
    major: "Computer Science(advanced)",
    period: "2026 – 2028",
  },
];

const techStack: TechCategory[] = [
  {
    name: "Full Stack",
    items: [
      "React", "Next.js", "TypeScript", "Go", "Python", "Node.js", "MongoDB", "PostgreSQL", "Redis",
    ],
  },
  {
    name: "Cryptography",
    items: ["Blockchain", "Zero-Knowledge Proofs", "Homomorphic Encryption"],
  },
  {
    name: "DevOps & Tools",
    items: ["Linux", "Nginx", "GitHub Actions", "Docker"],
  },
  {
    name: "Exploring...",
    items: ["Neural Networks", "AI Architecture", "AI Applications"],
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
      <div className="h-24" />

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
