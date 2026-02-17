"use client";

import Image from "next/image";
import { Github, Mail } from "lucide-react";

/**
 * Profile card shown on the home page.
 *
 * Displays avatar, name, tagline and social links inside
 * a glassmorphism container.
 */
export default function ProfileCard() {
  return (
    <aside className="glass flex flex-col items-center gap-4 rounded-[var(--radius-lg)] px-6 py-8">
      {/* Avatar */}
      <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-[var(--accent-subtle)]">
        <Image
          src="/images/profile_photo.png"
          alt="Whalefall"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Name & tagline */}
      <div className="text-center">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          Whalefall
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Developer · Blogger · Explorer
        </p>
      </div>

      {/* Social links */}
      <div className="flex gap-3">
        <SocialIcon
          href="https://github.com/"
          label="GitHub"
          icon={<Github className="h-4 w-4" />}
        />
        <SocialIcon
          href="mailto:hello@example.com"
          label="Email"
          icon={<Mail className="h-4 w-4" />}
        />
      </div>
    </aside>
  );
}

function SocialIcon({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white"
    >
      {icon}
    </a>
  );
}
