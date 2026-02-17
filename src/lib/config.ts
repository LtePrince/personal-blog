import type { SiteConfig } from "@/types/config";

/**
 * Centralised site configuration.
 *
 * All hard-coded site-level constants live here so components stay pure.
 */
export const siteConfig: SiteConfig = {
  title: "Whalefall's Blog",
  description: "Personal blog of Whalefall: posts, interests and projects.",
  defaultLocale: "en",
  navLinks: [
    { label: { "zh-CN": "首页", en: "Home" }, href: "/home" },
    { label: { "zh-CN": "博客", en: "Blogs" }, href: "/blog" },
    { label: { "zh-CN": "实验室", en: "MyLab" }, href: "/lab" },
    { label: { "zh-CN": "关于", en: "About" }, href: "/about" },
  ],
};
