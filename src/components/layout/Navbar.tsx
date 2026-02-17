"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
  Languages,
  Anchor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocale } from "@/contexts/LocaleContext";

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* --- scroll-aware background ------------------------------------ */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --- lock body scroll when mobile menu is open ------------------ */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);
  const toggleLocale = useCallback(
    () => setLocale(locale === "en" ? "zh-CN" : "en"),
    [locale, setLocale],
  );

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* -------- Desktop / Tablet Navbar -------- */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled ? "glass-heavy shadow-md" : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          {/* Logo */}
          <Link
            href="/home"
            className="flex items-center gap-2.5 font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
          >
            <Anchor className="h-5 w-5 text-[var(--accent)]" />
            <span className="text-base tracking-tight">{siteConfig.title}</span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-1 md:flex">
            {siteConfig.navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                    isActive(link.href)
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-subtle)]",
                  )}
                >
                  {t(link.label)}
                  {/* Active indicator dot */}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0.5 left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right-side controls */}
          <div className="flex items-center gap-1">
            {/* Language toggle */}
            <button
              onClick={toggleLocale}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)]"
              aria-label="Switch language"
              title={locale === "en" ? "切换为中文" : "Switch to English"}
            >
              <Languages className="h-[18px] w-[18px]" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-[18px] w-[18px]" />
              ) : (
                <Moon className="h-[18px] w-[18px]" />
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)] md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* -------- Mobile Menu Overlay -------- */}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeMobileMenu}
        aria-hidden
      />

      {/* Slide-in panel */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-64 flex-col gap-2 p-6 pt-20 transition-transform duration-300 glass-heavy md:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {siteConfig.navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMobileMenu}
            className={cn(
              "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
              isActive(link.href)
                ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)]",
            )}
          >
            {t(link.label)}
          </Link>
        ))}
      </aside>
    </>
  );
}
